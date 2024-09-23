import { Garage } from "@/components/modules/garage";
import { LeaderBoard } from "@/components/modules/leaderboard";
import { Menu } from "@/components/modules/menu";

export const ModulesPage = () => {
  return (
    <div>
      <Menu />
      <Garage />
      <LeaderBoard />
    </div>
  );
};
