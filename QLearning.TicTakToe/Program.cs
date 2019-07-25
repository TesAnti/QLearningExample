using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Nancy;
using Nancy.Hosting.Self;

namespace QLearning.TicTakToe
{
    class Program
    {
        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }
        static void Main(string[] args)
        {
            using (var nancyHost = new NancyHost(new CustomBootstrapper(),new HostConfiguration(){RewriteLocalhost = true,UrlReservations = new UrlReservations(){CreateAutomatically = true}}, new Uri("http://localhost:80/")))
            {
                
                nancyHost.Start();

                Console.WriteLine($"http://{GetLocalIPAddress()}:80/");

                while (true)
                {
                    Thread.Sleep(100);
                }
            }
        }
    }
}
