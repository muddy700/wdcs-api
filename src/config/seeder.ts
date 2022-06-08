import { constants } from "./constants";
import { seedTestingUser } from "../modules/users/seeder";
import { seedUser } from "../modules/accessControl/seeder/";
import { seedTestingPius } from "../modules/pius/seeder/index";
import { seedTestingProjects } from "../modules/projects/seeder/index";
import { seedInitialRoles } from "../modules/accessControl/seeder/role.seeder";
import { seedProjectPhases } from "../modules/projectPhases/seeder/projectPhase.seeder";
import { seedTestingStakeholders } from "../modules/stakeholders/seeder/stakeholder.seeder";
import { seedEngagementPlans } from "../modules/engagementPlans/seeder/engagementPlan.seeder";

export const seedInitialData = async () => {
  try {
    // seedConfigurations();

    await seedUser();

    if (constants.NODE_ENV === "dev") {
      await seedInitialRoles();

      // await seedTestingUser();Commitments

      // await seedTestingPius(3);

      // await seedTestingProjects(2);

      // await seedTestingStakeholders(2);

      // await seedProjectPhases(2)

      // await seedEngagementPlans(2);
    }
  } catch (e) {
    return {
      developerMessage: e.message,
    };
  }
};
