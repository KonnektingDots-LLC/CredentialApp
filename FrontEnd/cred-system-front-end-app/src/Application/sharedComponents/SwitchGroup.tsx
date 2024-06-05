interface Props {
    isActive: boolean;
    onToggle: (navigateTo: string) => void
    labels: string[];
  }
  
  const SwitchGroup = ({ isActive, onToggle, labels }: Props) => {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="usa-button-group usa-button-group--segmented">
          {labels.map((label) => {
            return (
              <li key={label+'-swith-button'} className="usa-button-group__item">
                <button
                  type="button"
                  className={`usa-button ${
                      (label === "Insurer's Employees" && isActive) || (label === "Providers" && !isActive) ? "" : "usa-button--outline"
                  }`}                
                  onClick={() => onToggle(label)}
              >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  export default SwitchGroup;