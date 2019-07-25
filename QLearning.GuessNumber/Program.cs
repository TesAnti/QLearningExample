using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QLearning.GuessNumber
{
    class Program
    {
        static void Main(string[] args)
        {
            QAgent<int,int> agent = new QAgent<int, int>();

            int secretNumber = 5;

            //for each state we can add 1 and subtract 1
            agent.RequestActionsForState = (int state) => new List<int>(){-1,1};

            
            for (int i = 0; i < 10; i++)
            {
                int guessedNumber = 0;
                Console.WriteLine("--------------------------");
                do
                {
                    //flag if game is finished
                    bool finish = false;
                    int prevstate = guessedNumber;
                    var action = agent.GetAction(guessedNumber);
                    var reward = -0.1;


                    //execute action
                    guessedNumber += action;
                    Console.WriteLine(guessedNumber);

                    

                    //specify the rule that guessed number cant be less than 0
                    if (guessedNumber < 0)
                    {
                        reward = -1;
                        finish = true;
                    }

                    //rule for victory
                    if (guessedNumber == secretNumber)
                    {
                        reward = 1;
                        finish = true;
                    }

                    //learn what would happen after action is executed
                    agent.UpdateState(prevstate, action, reward, guessedNumber);
                    
                    //finish the game
                    if (finish) break;
                } while (true);
            }

            Console.ReadLine();

        }
    }
}
