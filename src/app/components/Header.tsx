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
          <a href="/">Home </a>
        </div>
        <div className="flex place-content-center pt-1">
          <div className=" px-[0.5px] h-5 mt-2 bg-gray-300"></div>
        </div>
        <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
          <a href="/pages/addPractice">Addition </a>
        </div>
        <div className="flex place-content-center pt-1">
          <div className=" px-[0.5px] h-5 mt-2 bg-gray-300"></div>
        </div>
        <div>
          <a href="/pages/subPractice">
            <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
              Subtraction
            </div>
          </a>
        </div>
        <div className="flex place-content-center pt-1">
          <div className=" px-[0.5px] h-5 mt-2 bg-gray-300"></div>
        </div>
        <div>
          <a href="/pages/mulPractice">
            <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
              Multiplication
            </div>
          </a>
        </div>
        <div className="flex place-content-center pt-1">
          <div className=" px-[0.5px] h-5 mt-2 bg-gray-300"></div>
        </div>
        <div>
          <a href="/pages/divPractice">
            <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
              Divide
            </div>
          </a>
        </div>
        <div className="flex place-content-center pt-1">
          <div className=" px-[0.5px] h-5 mt-2 bg-gray-300"></div>
        </div>
        <div>
          <a href="/pages/login">
            <div className="hover:bg-gray-200 py-2 focus:bg-amber-500 active:bg-gray-100 px-4">
              login
            </div>
          </a>
        </div>
      </div>
      <Separator className="mb-2" />
    </div>
  );
}
