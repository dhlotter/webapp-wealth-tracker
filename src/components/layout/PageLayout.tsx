import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const PageLayout = ({ title, description, children }: PageLayoutProps) => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageLayout;