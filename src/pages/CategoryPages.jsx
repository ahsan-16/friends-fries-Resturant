import MenuPage from "./MenuPage";

export function BurgersPage() {
  return (
    <MenuPage
      title="BURGERS"
      subtitle="Handcrafted"
      emoji="🍔"
      category="BURGERS"
      tags={["spicy", "crispy", "double", "cheese"]}
    />
  );
}

export function PizzaPage() {
  return (
    <MenuPage
      title="PIZZA"
      subtitle="Freshly Baked"
      emoji="🍕"
      category="PIZZA"
      tags={["classic", "premium", "spicy", "creamy", "stuffed"]}
    />
  );
}

export function ShawarmaPage() {
  return (
    <MenuPage
      title="SHAWARMA & WRAPS"
      subtitle="Fresh Rolled"
      emoji="🌯"
      category="SHAWARMA"
      tags={["wrap", "grilled", "crispy", "desi", "cheese"]}
    />
  );
}

export function FriesPage() {
  return (
    <MenuPage
      title="FRIES & SIDES"
      subtitle="Crispy Golden"
      emoji="🍟"
      category="FRIES"
      tags={["classic", "loaded", "fusion", "chicken", "large"]}
    />
  );
}

export function DrinksPage() {
  return (
    <MenuPage
      title="DRINKS & JUICES"
      subtitle="Fresh & Chilled"
      emoji="🥤"
      category="DRINKS"
      tags={["milkshake", "icecream shake", "fresh juice", "soda", "premium"]}
    />
  );
}