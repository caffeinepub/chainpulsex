import { createContext, useContext, useEffect, useState } from "react";

interface RouterContextType {
  location: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  location: "/",
  navigate: () => {},
});

export function Router({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(
    () => window.location.hash.slice(1) || "/",
  );

  useEffect(() => {
    const handler = () => setLocation(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useLocation() {
  return useContext(RouterContext).location;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function Link({
  to,
  children,
  onClick,
  className,
  style,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { navigate } = useContext(RouterContext);
  return (
    <a
      href={`#${to}`}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

export function Route({
  path,
  element,
}: { path: string; element: React.ReactNode }) {
  const { location } = useContext(RouterContext);
  if (location !== path) return null;
  return <>{element}</>;
}

export function Routes({ children }: { children: React.ReactNode }) {
  const { location } = useContext(RouterContext);
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const props = (
      child as { props: { path?: string; element?: React.ReactNode } }
    ).props;
    if (props.path === location || (props.path === "*" && location)) {
      return <>{props.element}</>;
    }
  }
  // Default to first route if nothing matches
  for (const child of childArray) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const props = (
      child as { props: { path?: string; element?: React.ReactNode } }
    ).props;
    if (props.path === "/") return <>{props.element}</>;
  }
  return null;
}
