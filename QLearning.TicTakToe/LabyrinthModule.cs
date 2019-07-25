using System;
using System.Collections.Generic;
using System.IO;
using Nancy;
using Newtonsoft.Json;

namespace QLearning.TicTakToe
{
    public class LabyrinthModule:NancyModule
    {
        public LabyrinthModule() : base("/labyrinth")
        {
            QAgent<int, string> agent = new QAgent<int, string>();
            agent.RequestActionsForState = i =>
            {
                var res= new List<string>() { "up", "down", "left", "right" };
                int y = i / 10;
                int x = i - y * 10;
                if (x == 0) res.Remove("left");
                if (x == 4) res.Remove("right");
                if (y == 4) res.Remove("down");
                if (y == 0) res.Remove("up");


                return res;
            };


            Post("/predict", o =>
            {
                var name = this.Request.Query["name"].ToString();
                var reader = new StreamReader(Request.Body);
                var state = reader.ReadToEnd();
                if (File.Exists($"agent{name}.json"))
                {
                    agent.Deserialize(File.ReadAllText($"agent{name}.json"));
                }

                return agent.GetAction(int.Parse(state)).ToString();
            });

            Post("/learn", o =>
            {
                var name = this.Request.Query["name"].ToString();
                if (File.Exists($"agent{name}.json"))
                {
                    agent.Deserialize(File.ReadAllText($"agent{name}.json"));
                }

                agent.UpdateState(int.Parse(this.Request.Form["prevState"].ToString()), this.Request.Form["action"].ToString(), int.Parse(this.Request.Form["reward"].ToString()), int.Parse(this.Request.Form["newState"].ToString()));

                File.WriteAllText($"agent{name}.json", agent.Serialize());
                return "OK";
            });
            Post("/overlay", o =>
            {
                var name = this.Request.Query["name"].ToString();
                if (File.Exists($"agent{name}.json"))
                {
                    agent.Deserialize(File.ReadAllText($"agent{name}.json"));
                }

                double[][] res = new double[5][];

                for (int y = 0; y < 5; y++)
                {
                    res[y]=new double[5];
                    for (int x = 0; x < 5; x++)
                    {
                        var state = y * 10 + x;
                        res[y][x]=agent.GetStateMaxScore(state);
                    }
                }

                return JsonConvert.SerializeObject(res);
            });
        }

    }
}