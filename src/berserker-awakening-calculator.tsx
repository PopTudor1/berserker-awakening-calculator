import React, { useState } from "react";
import AttackIcon from "./assets/attack-icon.png";
import AwakeningStoneIcon from "./assets/awakening-stone-icon.png";
import BerserkerIcon from "./assets/berserk-icon.png";
import BossDamageIcon from "./assets/boss-damage-icon.png";
import DragonKeyIcon from "./assets/dragon-key-icon.png";
import SkillDamageIcon from "./assets/skill-damage-icon.png";

type Category = {
  currentLevel: string;
  maxLevel: string;
  result: JSX.Element | null;
};
type RankButtonsProps = {
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export default function BerserkerAwakeningCalculator() {
  const categoryLabels = [
    "Attack",
    "Skill Damage",
    "Boss Damage",
    "Berserk Attack",
    "Health",
    "Berserk Critical Damage",
  ];

  const categoryImages = [
    AttackIcon,
    SkillDamageIcon,
    BossDamageIcon,
    BerserkerIcon,
    BerserkerIcon,
    BerserkerIcon,
  ];

  const RankButtons = ({ setCategories }: RankButtonsProps) => {
    const rankProgression = [
      {
        from: "D",
        to: "C",
        maxLevel: 1,
        fromColor: "#c0c0c0",
        toColor: "#77dd77",
      },
      {
        from: "C",
        to: "B",
        maxLevel: 10,
        fromColor: "#77dd77",
        toColor: "#1771E6",
      },
      {
        from: "B",
        to: "A",
        maxLevel: 50,
        fromColor: "#1771E6",
        toColor: "#FF7416",
      },
      {
        from: "A",
        to: "S",
        maxLevel: 120,
        fromColor: "#FF7416",
        toColor: "#F02F2F",
      },
      {
        from: "S",
        to: "SR",
        maxLevel: 220,
        fromColor: "#F02F2F",
        toColor: "#AE2BFF",
      },
      {
        from: "SR",
        to: "SSR",
        maxLevel: 500,
        fromColor: "#AE2BFF",
        toColor: "#F4E639",
      },
    ];

    const handleRankClick = (maxLevel: number) => {
      setCategories((prev: Category[]) =>
        prev.map((cat: Category) => ({
          ...cat,
          currentLevel: "1",
          maxLevel: maxLevel.toString(),
        }))
      );
    };

    return (
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Select your awakening status:
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {rankProgression.map((rank, index) => (
            <button
              key={index}
              onClick={() => handleRankClick(rank.maxLevel)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid orange",
                borderRadius: "8px",
                backgroundColor: "rgb(31, 41, 55)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: rank.fromColor,
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {rank.from}
              </span>
              <span style={{ fontWeight: "400", fontSize: "20px" }}>⇒</span>
              <span
                style={{
                  color: rank.toColor,
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {rank.to}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const [valuePerKey, setValuePerKey] = useState<number>(51200);

  const initialCategories = categoryLabels.map(() => ({
    currentLevel: "1",
    maxLevel: "",
    result: null, // Initialize result as null (will store JSX here)
  }));

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [totalKeys, setTotalKeys] = useState<number | null>(null);

  const increment = 100;

  const handleInputChange = (
    index: number,
    field: string,
    value: number | string
  ) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const calculateAllKeys = () => {
    let total = 0;

    const updatedResults = categories.map(({ currentLevel, maxLevel }) => {
      if (
        !currentLevel ||
        !maxLevel ||
        isNaN(valuePerKey) ||
        valuePerKey <= 0
      ) {
        return <span>Please enter valid numbers.</span>;
      }

      const start = Number(currentLevel + 1) * 100 + 100;
      const end = Number(maxLevel) * 100 + 100;

      if (start >= end) {
        return <span>Current level must be less than max level.</span>;
      }

      let totalSum = 0;
      for (let i = start; i <= end; i += increment) {
        totalSum += i;
      }

      const numberOfKeys = Math.floor(totalSum / valuePerKey);
      total += numberOfKeys;

      return (
        <div style={styles.resultContainer}>
          <span style={styles.resultText}>
            Awakening stone needed: {totalSum.toLocaleString()}
            <img
              src={AwakeningStoneIcon}
              alt="Awakening Stone"
              style={styles.icon}
            />
          </span>
          <span style={styles.resultText}>
            Dragon Keys Needed: {numberOfKeys}
            <img src={DragonKeyIcon} alt="Dragon Key" style={styles.icon} />
          </span>
        </div>
      );
    });

    setCategories((prev) =>
      prev.map((cat, i) => ({
        ...cat,
        result: updatedResults[i],
      }))
    );

    setTotalKeys(total);
  };

  const clearAll = () => {
    setCategories(initialCategories);
    setTotalKeys(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: "red" }}>Dragon Key Calculator</h1>
      <p>( made by Tudique26 from the KNIGHTSXORDER guild on Trakan server )</p>
      <div style={styles.topRow}>
        <label style={styles.topLabel}>Awakening stone per key:</label>
        <img
          src={AwakeningStoneIcon}
          alt="Awakening Stone"
          style={styles.awakeningImage}
        />
        <input
          type="number"
          value={valuePerKey}
          onChange={(e) => setValuePerKey(Number(e.target.value))}
          style={styles.input}
        />

        <button onClick={calculateAllKeys} style={styles.buttonInline}>
          Calculate Keys
        </button>
        <button onClick={clearAll} style={styles.clearButton}>
          Clear
        </button>
      </div>
      <RankButtons setCategories={setCategories} />

      {categoryLabels.map((label, index) => (
        <div key={index} style={styles.form}>
          <div style={styles.row}>
            <img
              src={categoryImages[index]}
              alt={`${label} icon`}
              style={styles.categoryImage}
            />
            <strong style={styles.label}>{label}:</strong>
            <input
              type="number"
              min={1}
              max={500}
              placeholder="Current Level"
              value={categories[index].currentLevel}
              onChange={(e) => {
                const rawValue = e.target.value;
                // Allow clearing the input
                if (rawValue === "") {
                  handleInputChange(index, "currentLevel", "");
                  return;
                }
                // Parse and clamp numeric input
                const parsed = Number(rawValue);
                if (!isNaN(parsed)) {
                  const clamped = Math.min(Math.max(parsed, 1), 500);
                  handleInputChange(index, "currentLevel", clamped);
                }
              }}
              style={styles.inlineInput}
            />
            <input
              type="number"
              min={1}
              max={500}
              placeholder="Max Level"
              value={categories[index].maxLevel}
              onChange={(e) => {
                const rawValue = e.target.value;
                // Allow clearing the input
                if (rawValue === "") {
                  handleInputChange(index, "maxLevel", "");
                  return;
                }
                // Parse and clamp numeric input
                const parsed = Number(rawValue);
                if (!isNaN(parsed)) {
                  const clamped = Math.min(Math.max(parsed, 1), 500);
                  handleInputChange(index, "maxLevel", clamped);
                }
              }}
              style={styles.inlineInput}
            />
          </div>
          <div style={styles.outputRow}>
            <span style={styles.outputText}>
              {categories[index].result || ""}
            </span>
          </div>
        </div>
      ))}

      {totalKeys !== null && (
        <div style={styles.totalRow}>
          <strong>
            Total Dragon Keys Needed: {totalKeys.toLocaleString()}
          </strong>
          <img src={DragonKeyIcon} alt="Dragon Key" style={styles.icon} />
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "99vw",
    height: "98vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  topLabel: {
    fontSize: "16px",
    minWidth: "120px",
    color: "#fff",
  },
  awakeningImage: {
    width: "30px",
    height: "30px",
  },
  input: {
    flex: "1",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #444",
    minWidth: "100px",
    backgroundColor: "#333",
    color: "#fff",
  },
  buttonInline: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  clearButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  form: {
    borderTop: "1px solid #444",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    width: "150px",
    fontSize: "16px",
    color: "#FFDB58",
  },
  inlineInput: {
    flex: "1",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "#fff",
    minWidth: "200px",
  },
  outputRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "40px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    paddingTop: "5px",
  },
  outputText: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  totalRow: {
    fontSize: "28px",
    textAlign: "center",
    color: "yellow",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  categoryImage: {
    width: "40px",
    height: "40px",
    marginRight: "10px",
  },
  resultContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  resultText: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  icon: {
    width: "20px",
  },
};
