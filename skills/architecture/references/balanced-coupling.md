# Balanced coupling

This model is from Vlad Khononov, *Balancing Coupling in Software Design* (2024). Use it to judge each boundary that an option creates, moves, or removes.

Components must share knowledge to work together, so coupling itself is not a defect. The model asks three things about each pair of components: how much knowledge they share, how far apart they are, and how often that knowledge changes.

## Integration strength

Integration strength is the amount of knowledge that one component shares with another. The levels, from strongest to weakest:

1. Intrusive. The consumer uses private details of the provider, for example its database tables, internal fields, or undocumented behavior. Any change in the provider can break the consumer.
2. Functional. The components implement parts of the same business rule, so they must change together. Example: two services that each enforce the same invariant.
3. Model. The components share a domain model. A change to the model changes both.
4. Contract. The provider publishes an integration contract that hides its model, for example a DTO or a versioned event schema. Only contract changes reach the consumer.

## Distance

Distance is how far apart the components are, and so how much a change across them costs. From near to far: functions in one module, modules in one service, services in one system, separate systems. Different owners add distance: another team, another organization.

## Volatility

Volatility is how often a component changes. Estimate it from the subdomain: core subdomains change often, supporting and generic subdomains change rarely. Use git history as evidence. A stable component that depends on a volatile one inherits its changes.

## The balance rule

Strength and distance must move in opposite directions:

| Strength | Distance | Result |
|----------|----------|--------|
| High | Low | High cohesion. Balanced. |
| Low | High | Loose coupling. Balanced. |
| High | High | Global complexity, for example a distributed monolith. Changes cascade across teams or services. |
| Low | Low | Local complexity. Unrelated things sit together. Low cohesion. |

Low volatility excuses an imbalance. An intrusive integration with a legacy system that nobody changes costs little.

Short form: balance = (strength XOR distance) OR NOT volatility.

## Finding boundaries from cohesion

The same model also proposes boundaries. Apply it at each level of distance: functions in a module, modules in a service, services in a system.

1. List the parts at the current level, for example the types in a module or the modules in a service.
2. For each pair that shares knowledge, estimate the integration strength. Evidence: a shared invariant or business rule (functional), shared domain types (model), and the git co-change rate.
3. Group the parts that have functional or model strength. Each group is a candidate unit at this level. Keep the parts of a group close.
4. Put a boundary between the groups. Across a boundary, allow only contract strength.
5. If a part has strong coupling to two groups, flag it. Either the groups belong together, or the part splits. Mark it as to check, and resolve it with the user or with `discover`.
6. Check volatility. A volatile group gets a narrow contract. A stable group can accept a stronger integration.

Then go up one level. Treat each group as one part and repeat.

Present each group as a proposal, with the evidence for it and its status: confirmed, to check, or assumed.

## Use in the procedure

- Forces: ask how volatile each affected component is and who owns it.
- Options: for each boundary, state its strength, distance, and volatility. Flag each unbalanced boundary.
- Tradeoffs: if an option increases distance, say how the strength drops to keep the balance, or what the imbalance costs.
- Fitness functions: turn each accepted boundary into a check. Examples: no module imports the internal package of another module. No service reads the tables of another service. The git co-change rate between two modules stays under a threshold.
