import {
  createMongoAbility,
  Subject,
  MongoQuery,
  AbilityBuilder,
} from "@casl/ability";

type PossibleAbilities = [string, Subject];
type Conditions = MongoQuery;

export const ability = createMongoAbility<PossibleAbilities, Conditions>();

export function convertAbility(data: any) {
  const { can, rules } = new AbilityBuilder(createMongoAbility);
  data?.forEach((m: any) => {
    can(m?.page_action?.action?.action_code, m?.page_action?.page?.page_code);
  });
  return rules;
}
