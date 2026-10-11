import React from "react";

interface ISettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, description, children }: ISettingsSectionProps) => {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3">
      <div>
        <h5 className="text-sm font-semibold">{title}</h5>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      {children}
    </section>
  );
};

export default SettingsSection;
