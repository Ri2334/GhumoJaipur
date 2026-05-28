import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Transport",
      desc: "Get real-time metro paths, bus routes, and book verified cabs or autos instantly.",
      icon: "🚌",
      link: "/transport"
    },
    {
      title: "Heritage Guides",
      desc: "Explore Jaipur's iconic forts, palaces, and markets with deep local insights and 2026 pricing.",
      icon: "🏰",
      link: "/places"
    },
    {
      title: "Planned Trips",
      desc: "Shortlist your favorite spots and sync them across devices for a seamless travel experience.",
      icon: "🗺️",
      link: "/saved-trips"
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)]">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/70 px-4 py-2 rounded-2xl mb-8 animate-in fade-in slide-in-from-bottom-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">Official Jaipur Tourism Assistant</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-tight">
              Explore Jaipur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Like a Local
              </span>
            </h1>
            
            <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed font-medium">
              Ghumo Jaipur is your all-in-one companion for navigating the Pink City. 
              Discover hidden gems, smart transport options, and authentic local experiences.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/places" 
                className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <span>Explore Places</span>
                <span className="text-xl">✨</span>
              </Link>
              <Link 
                to={user ? "/dashboard" : "/signup"} 
                className="w-full sm:w-auto bg-white text-indigo-600 border-2 border-indigo-50 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <span>{user ? "Go to Dashboard" : "Get Started Now"}</span>
                <span className="text-xl">🚀</span>
              </Link>
            </div>

            {!user && (
              <p className="mt-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
              </p>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/40 backdrop-blur-xl relative z-10 border-y border-white/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                onClick={() => navigate(f.link)}
                className="group cursor-pointer p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {f.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition">
                  Learn More <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Improved About Section */}
      <section id="about" className="py-24 md:py-32 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[3.5rem] border border-white p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20 relative z-10">
              <div className="relative group">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square transform group-hover:rotate-1 transition-transform duration-500">
                   <img 
                     src="https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/hawamahal_owadja.jpg" 
                     alt="Hawa Mahal" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent"></div>
                   <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-xs font-black uppercase tracking-[0.4em] mb-2 opacity-80">Heritage Landmark</p>
                      <h4 className="text-3xl font-black">Hawa Mahal</h4>
                   </div>
                </div>
                {/* Visual badge */}
                <div className="absolute -bottom-6 -right-6 bg-indigo-600 p-6 rounded-[2rem] text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                   <div className="text-3xl font-black mb-1">100+</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Local Spots</div>
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.5em] text-indigo-600 mb-6 flex items-center gap-4">
                  <span className="w-10 h-0.5 bg-indigo-600"></span>
                  Our Story
                </p>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                  Preserving heritage, <br />
                  <span className="text-indigo-600">Powering travel.</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                  <p>
                    Jaipur is a city of stories and timeless architecture. But navigating it shouldn't feel like a puzzle. 
                    Ghumo Jaipur was built to bridge the gap between traditional tourism and modern convenience.
                  </p>
                  <p>
                    We provide real-time public transport logic, a curated network of verified drivers, and deep-dive guides 
                    into the city's most iconic locations.
                  </p>
                </div>
                
                <div className="mt-12 flex flex-wrap gap-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">✨</div>
                      <div>
                        <div className="text-gray-900 font-black">2026 Ready</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Updated Prices</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-2xl">🚇</div>
                      <div>
                        <div className="text-gray-900 font-black">Smart Metro</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Paths</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </section>

      {/* Logged Out Meaningful UI */}
      {!user && (
        <section className="pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-[3.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 text-center max-w-3xl mx-auto">
                 <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to unlock Jaipur's potential?</h2>
                 <p className="text-indigo-50 text-xl font-medium mb-10 leading-relaxed opacity-90">
                   Join thousands of travelers who use Ghumo Jaipur to save trips, book rides, and get personalized recommendations.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Link to="/signup" className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition shadow-xl">Create Account</Link>
                   <Link to="/login" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition">Login</Link>
                 </div>
               </div>
               {/* Abstract pattern bg */}
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[80px]"></div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white/50 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">© 2026 Ghumo Jaipur • Built with ❤️ for the Pink City</p>
        </div>
      </footer>

    </div>
  );
}
