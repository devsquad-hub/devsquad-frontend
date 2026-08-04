export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="content-heading">
      <div>
        <h1 className="section-title">{title}</h1>
        <p className="section-description">{description}</p>
      </div>
      {action}
    </div>
  );
}
