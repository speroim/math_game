import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Separator } from "../../components/ui/separator";

export default function Header() {
  return (
    <div className="header">
      <div className="bg-white flex place-content-start px-4">
        <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
          <a href="/">item 1</a>
        </div>
        <Separator orientation="vertical" />
        <a href="/">
          <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
            item 2
          </div>
        </a>
      </div>
      <Separator className="mb-2" />
    </div>
  );
}
