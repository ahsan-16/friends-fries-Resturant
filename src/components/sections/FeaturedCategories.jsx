import { Link } from "react-router-dom";
import { menuCategories } from "../../data/menu";

export default function FeaturedCategories() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">What We Serve</p>
          <h2 className="section-title">
            EXPLORE THE <span className="gradient-text">MENU</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {menuCategories.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.slug}
              className="group flex flex-col items-center gap-3 p-5 card-dark hover:border-brand-red/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-red/10"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-5xl group-hover:scale-125 transition-transform duration-300">{cat.icon}</div>
              <span className="font-heading font-bold text-white text-sm uppercase tracking-wide text-center leading-tight">
                {cat.label}
              </span>
              <div className="w-6 h-0.5 bg-brand-red rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
