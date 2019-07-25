using Nancy;
using Nancy.Conventions;

namespace QLearning.TicTakToe
{
    public class CustomBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);

            conventions.StaticContentsConventions.AddDirectory("/","static");
        }
    }
}