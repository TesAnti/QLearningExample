using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace QLearning
{
    public class QAgent<TState,TAction> where TState:IComparable where TAction:IComparable
    {
        private Random _rand;
        private Dictionary<TState,Dictionary<TAction,double>> _qStates=new Dictionary<TState, Dictionary<TAction, double>>();
        /// <summary>
        /// Creates Q-learning agent
        /// </summary>
        public QAgent():this(0){}

        /// <summary>
        /// Creates Q-learning agent
        /// <param name="seed">seed of random number generator</param>
        /// </summary>
        public QAgent(int seed)
        {
            _rand=new Random(seed);
        }

        /// <summary>
        /// How fast values are changing after each step
        /// Should be between 0.0 and 1.0
        /// </summary>
        public double LearningRate { get; set; } = 0.9;

        /// <summary>
        /// How much influence previous score has on new one
        /// Should be between 0.0 and 1.0
        /// </summary>
        public double DiscountFactor { get; set; } = 0.99;

        /// <summary>
        /// Balance between exploration and exploitation
        /// The higher the value the more often algorithm will make random decisions
        /// </summary>
        public double Epsilon { get; set; }

        /// <summary>
        /// Generator for possible actions for specified state
        /// </summary>
        public Func<TState, List<TAction>> RequestActionsForState;

        private void EnsureStateExists(TState state)
        {
            

            if (!_qStates.ContainsKey(state))
            {
                Dictionary<TAction,double> stateActions=new Dictionary<TAction, double>();
                if (RequestActionsForState == null) throw new Exception($"Unknown state. {nameof(RequestActionsForState)} should be set");
                var actions = RequestActionsForState(state);
                foreach (TAction action in actions)
                {
                    stateActions[action] = 0.0;
                }

                _qStates[state] = stateActions;
            }
        }

        /// <summary>
        /// Returns max action score for specified state
        /// </summary>
        /// <param name="state"></param>
        public double GetStateMaxScore(TState state)
        {
            EnsureStateExists(state);
            int actionsCount = _qStates[state].Count;

            if (actionsCount == 0) throw new Exception("This state has no actions");
            var maxAction = _qStates[state].OrderByDescending(x => x.Value).First().Value;
            return maxAction;
        }

        /// <summary>
        /// Returns the best action for specified state
        /// </summary>
        public TAction GetAction(TState state)
        {
            EnsureStateExists(state);

            

            
            int actionsCount = _qStates[state].Count;

            if(actionsCount==0)throw new Exception("This state has no actions");

            // find the best action 
            var maxAction = _qStates[state].OrderByDescending(x => x.Value).First();
            double maxReward = maxAction.Value;
            TAction greedyAction = maxAction.Key;

  
            // try to do exploration
            if (_rand.NextDouble() < Epsilon)
            {
                int randomAction = _rand.Next(actionsCount - 1);
                
                return _qStates[state].ToList()[randomAction].Key;
            }

            return greedyAction;
        }
        /// <summary>
        /// Save agent memory into string
        /// </summary>
        public string Serialize()
        {
            return JsonConvert.SerializeObject(_qStates);
        }
        /// <summary>
        /// Load agent memory from string
        /// </summary>
        public void Deserialize(string serialized)
        {
            _qStates = JsonConvert.DeserializeObject<Dictionary<TState, Dictionary<TAction, double>>>(serialized);
        }

        /// <summary>
        /// Learn iteration
        /// </summary>
        /// <param name="previousState">source state</param>
        /// <param name="action">action which lead to switch from source state to target state</param>
        /// <param name="reward">reward for performing the action</param>
        /// <param name="nextState">target state</param>
        public void UpdateState(TState previousState, TAction action, double reward, TState nextState)
        {

            
            EnsureStateExists(previousState);
            EnsureStateExists(nextState);
            
            // next state's action estimations
            var nextActionEstimations=_qStates[nextState];

            



            // find maximum expected summary reward from the next state
            double maxNextExpectedReward=0;
            if(nextActionEstimations.Count>0)
                maxNextExpectedReward = nextActionEstimations.Max(x => x.Value);

            // previous state's action estimations
            var previousActionEstimations = _qStates[previousState];

            // update expexted summary reward of the previous state
            previousActionEstimations[action] *= (1.0 - LearningRate);
            previousActionEstimations[action] += (LearningRate * (reward + DiscountFactor * maxNextExpectedReward));
        }


    }
}