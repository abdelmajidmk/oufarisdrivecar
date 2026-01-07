import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location de voiture – Oufaris Drive Car",
  description:
    "Réservez votre voiture en ligne avec Oufaris Drive Car.",
};

export default function Home() {
  return (
    <main>
      <h1>Location de voiture avec Oufaris Drive Car</h1>
      <p>
        Oufaris Drive Car vous propose un service de location de voiture fiable,
        rapide et au meilleur prix.
      </p>
    </main>
  );
}
