# Travelling Salesman Problem Playground

This interactive mini-lab visualises four classic strategies for tackling the Travelling Salesman Problem (TSP). Load one of the curated city layouts, tweak the algorithm parameters, and compare the quality and runtime tradeoffs between greedy, stochastic, and exact methods.

## Included Datasets

- **European Capitals (11)** – Normalised coordinates for a compact tour across continental Europe.
- **US Tech Corridor (12)** – Coast-to-coast route linking innovation hubs across the United States.
- **Clustered Random (11)** – Seeded synthetic clusters regenerated each time `Shuffle Layout` is enabled.

Each dataset is sized to keep the exact solver responsive while still highlighting the strengths and weaknesses of the heuristics.

## Using the Playground

1. Pick a dataset and starting city in the control panel.
2. Optionally adjust algorithm parameters:
   - Genetic Algorithm population, generations, and mutation rate.
   - Simulated Annealing start temperature, cooling rate, and inner-loop sweeps.
3. Run a single algorithm or use **Compare All Methods** to execute the full suite and highlight the best tour.
4. Inspect the live map, distance metrics, runtime estimates, and ordered visit list to understand how the route was constructed.

## Algorithm Highlights

### Nearest Neighbor
- Greedy heuristic that always visits the closest unvisited city.
- Completes instantly and provides a solid baseline, but can get trapped in local minima.

### Genetic Algorithm
- Maintains a population of candidate tours evolved via ordered crossover and swap mutations.
- Balances exploitation and exploration to improve solutions across generations.
- History hints are surfaced in the summary text after each run.

### Simulated Annealing
- Starts from a random tour and repeatedly applies swaps, occasionally accepting worse moves while the system “cools”.
- Excellent for escaping local minima when tuned with a gentle cooling schedule.

### Concorde (Branch & Bound)
- Implements an exact Held–Karp dynamic programming solver inspired by Concorde’s branch-and-bound guarantees.
- Returns the provably optimal tour for the provided datasets, making it ideal for benchmarking heuristics.

## Tips for Exploration

- Use the greedy solution as a seed, then run the stochastic methods to see where they diverge.
- Enable `Shuffle Layout` on the clustered dataset to stress-test robustness against different local optima.
- Compare runtime estimates to appreciate why Concorde is reserved for smaller instances in practice.

Happy touring! Explore the trade-offs between speed and optimality by mixing and matching heuristics, metaheuristics, and exact search. 
