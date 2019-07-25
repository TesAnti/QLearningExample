using System.Collections.Generic;
using System.IO;
using System.Linq;
using Nancy;

namespace QLearning.TicTakToe
{
    public class TTTModule:NancyModule
    {

        

        public TTTModule():base("/ttt")
        {
            QAgent<string,int> agentX = new QAgent<string, int>();
            agentX.RequestActionsForState = SpaceIndexes;

            QAgent<string, int> agentO = new QAgent<string, int>();
            agentO.RequestActionsForState = SpaceIndexes;

            Post("/predict", o =>
            {
                var name = this.Request.Query["name"].ToString();
                var reader = new StreamReader(Request.Body);
                var state = reader.ReadToEnd();
                if (File.Exists($"agent{name}.json"))
                {
                    agentX.Deserialize(File.ReadAllText($"agent{name}.json"));
                }

                return agentX.GetAction(state).ToString();
            });

            Post("/learn", o =>
            {
                var name = this.Request.Query["name"].ToString();
                if (File.Exists($"agent{name}.json"))
                {
                    agentX.Deserialize(File.ReadAllText($"agent{name}.json"));
                }

                agentX.UpdateState(this.Request.Form["prevState"].ToString(), int.Parse(this.Request.Form["action"].ToString()), int.Parse(this.Request.Form["reward"].ToString()), this.Request.Form["newState"].ToString());
                
                File.WriteAllText($"agent{name}.json", agentX.Serialize()); 
                return "OK";
            });

            
        }


        /// <summary>
        /// Gets indexes of spaces inside of provided string
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private List<int> SpaceIndexes(string str)
        {
            return str.Select((x, i) => new {c = x, i}).Where(x => x.c == ' ').Select(x => x.i).ToList();
        }
    }
}