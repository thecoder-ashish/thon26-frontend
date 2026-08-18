import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { SideMenu } from "@/components/SideMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth";
import { DropdownProfileMenu } from "@/components/admin/DropdownProfileMenu";
import { useMarquee } from '@/components/auth/MarqueeContext';


export function NavigationBar() {
  // render navbar only when user logged in details are fetched
  const { user, loading } = useAuth();
  const { setIsMarqueePaused } = useMarquee();

  if (loading) {
    return null; // or return a loading indicator, or keep your UI consistent while waiting.
  }
  return (
    <div className="flex p-4 justify-between w-full border-b border-gray-500">
      {/* Left: NSUTTHON */}
      <Link to="/">
        <div className="relative active:scale-95 hover:scale-95 transition-all cursor-grab z-20 pt-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="mr-2 stroke-black dark:stroke-white h-6 w-6"
          >
            <path
              d="M23.8222 23.6119L16.9206 13.1154L16.0109 14.5579L20.8404 21.8867C20.9159 22.0013 20.8435 22.1639 20.717 22.1639H16.3907C16.3406 22.1639 16.2936 22.1364 16.2648 22.0901L12.9433 16.7513C12.9057 16.6911 12.9061 16.6106 12.9441 16.5506L23.1892 0.385706C23.2621 0.270851 23.1892 0.111115 23.0642 0.111115H15.3934C15.3453 0.111115 15.3 0.136451 15.2709 0.179722L12.0753 4.93222C12.0132 5.02456 11.89 5.02351 11.829 4.93029L8.72731 0.181652C8.6983 0.137255 8.65241 0.111115 8.60348 0.111115H0.69907L7.8474 11.3323C7.88593 11.3927 7.88598 11.4742 7.84755 11.5347L0.176278 23.6142C0.103384 23.7291 0.176064 23.8889 0.301258 23.8889H8.16858C8.21864 23.8889 8.26566 23.8614 8.29437 23.8151L10.9997 19.4724L10.7963 19.1417L11.0023 19.4683L11.0039 19.471L11.7979 18.2804L11.9359 18.0735L15.5594 23.816C15.5883 23.8618 15.6349 23.8889 15.6847 23.8889H23.6986C23.825 23.8889 23.8975 23.7264 23.8222 23.6119ZM12.8403 6.46034L15.8523 1.84014C15.8813 1.79574 15.9272 1.76944 15.9761 1.76944H20.1877C20.3135 1.76944 20.386 1.9307 20.3118 2.0454L15.2277 9.90028C15.1667 9.99456 15.0423 9.99534 14.9803 9.90173L12.8409 6.66706C12.8004 6.60584 12.8003 6.52184 12.8403 6.46034ZM11.9213 14.8206L10.6287 13.1331L9.66694 14.4775L11.0149 16.6138L10.88 16.8249L10.1741 17.9312L10.1718 17.9275L10.101 18.0392L7.54905 22.0659C7.52019 22.1116 7.47356 22.1386 7.42404 22.1386H3.30706C3.18179 22.1386 3.10911 21.9785 3.18222 21.8637L11.1092 9.4165L10.2301 8.02228L10.22 8.00878L8.92701 9.95111C8.86478 10.0447 8.73997 10.0433 8.67935 9.94839L3.71185 2.17039C3.63853 2.05561 3.71114 1.89531 3.83655 1.89531H8.07327C8.12294 1.89531 8.16947 1.92234 8.19823 1.96786L14.2181 11.4578C14.2569 11.5189 14.2564 11.6013 14.2169 11.6619L12.1614 14.81C12.1029 14.8996 11.9858 14.9048 11.9213 14.8206Z"
              className="fill-black dark:fill-[white]"
            />
          </svg>
          <h1 className="font-raleway text-2xl font-black tracking-tight">NSUTTHON</h1>
        </div>
      </Link>

      {/* Middle: Leaderboard and Events */}
      <div className="space-x-4 hidden items-center sm:flex">
        <Link to="/leaderboard">
          <Button
            variant="outline"
            className="w-full font-raleway font-bold tracking-wide"
            type="button"
          >
            LEADERBOARD
          </Button>
        </Link>
        <Link to="/events">
          <Button
            variant="outline"
            className="w-full font-raleway font-bold tracking-wide"
            type="button"
          >
            EVENTS
          </Button>
        </Link>
      </div>

      {/* Right: Login, profile, Sign Up, ModeToggle, and SideMenu */}
      <div className="flex space-x-4 items-center">
        <Link to="/register">
          <Button
            variant="outline"
            className="w-full font-raleway font-bold tracking-wide"
            type="button"
          >
            REGISTER
          </Button>
        </Link>

        {user && (
          <div className="font-raleway hidden md:block">
            <DropdownProfileMenu />
          </div>
        )}

        <div className="hidden space-x-4 items-center sm:flex">
          <ModeToggle />
        </div>
        <div className="sm:hidden" onClick={() => setIsMarqueePaused(prev => !prev)}>
            <SideMenu />
        </div>
      </div>
    </div>
  );
}
