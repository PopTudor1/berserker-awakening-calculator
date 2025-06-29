import React, { useState } from "react";
import AttackIcon from "./assets/attack-icon.png";
import AwakeningStoneIcon from "./assets/awakening-stone-icon.png";
import BerserkerIcon from "./assets/berserk-icon.png";
import BossDamageIcon from "./assets/boss-damage-icon.png";
import DragonKeyIcon from "./assets/dragon-key-icon.png";
import SkillDamageIcon from "./assets/skill-damage-icon.png";
import "./berserker-awakening-calculator.css";

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
      <div className="rank-buttons-container">
        <label className="select-awakening-status">
          Select your awakening status:
        </label>
        <div className="rank-buttons-list">
          {rankProgression.map((rank, index) => (
            <button
              key={index}
              onClick={() => handleRankClick(rank.maxLevel)}
              className="rank-button"
            >
              <span
                style={{
                  color: rank.fromColor,
                }}
                className="rank-from-to"
              >
                {rank.from}
              </span>
              <span className="arrow">⇒</span>
              <span
                style={{
                  color: rank.toColor,
                }}
                className="rank-from-to"
              >
                {rank.to}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const [valuePerKey, setValuePerKey] = useState<string>("");

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
        isNaN(Number(valuePerKey)) ||
        Number(valuePerKey) <= 0
      ) {
        return <span>Please enter valid numbers.</span>;
      }

      const start = (Number(currentLevel) + 1) * 100 + 100;
      const end = Number(maxLevel) * 100 + 100;

      if (start >= end) {
        return <span>Current level must be less than max level.</span>;
      }

      let totalSum = 0;
      for (let i = start; i <= end; i += increment) {
        totalSum += i;
      }

      const numberOfKeys = Math.floor(totalSum / Number(valuePerKey));
      total += numberOfKeys;

      return (
        <div className="resultContainer">
          <span className="resultText">
            Awakening stone needed: {totalSum.toLocaleString()}
            <img
              src={AwakeningStoneIcon}
              alt="Awakening Stone"
              className="icon"
            />
          </span>
          <span className="resultText">
            Dragon Keys Needed: {numberOfKeys}
            <img src={DragonKeyIcon} alt="Dragon Key" className="icon" />
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
    <div className="container">
      <h1 className="container-title">Dragon Key Calculator</h1>
      <span className="madeBy">
        ( made by Tudique26 from the KNIGHTSXORDER guild on Trakan server )
      </span>
      <div className="topRow">
        <label className="topLabel">Awakening stone per key:</label>
        <div className="img-input-container">
          <img
            src={AwakeningStoneIcon}
            alt="Awakening Stone"
            className="awakeningImage"
          />
          <input
            type="number"
            value={valuePerKey}
            onChange={(e) => setValuePerKey(e.target.value)}
            className="input"
          />
        </div>
        <div className="buttons-container">
          <button onClick={calculateAllKeys} className="buttonInline">
            Calculate Keys
          </button>
          <button onClick={clearAll} className="clearButton">
            Clear
          </button>
        </div>
      </div>
      <RankButtons setCategories={setCategories} />

      {categoryLabels.map((label, index) => (
        <div key={index} className="form">
          <div className="row">
            <img
              src={categoryImages[index]}
              alt={`${label} icon`}
              className="categoryImage"
            />
            <strong className="label">{label}:</strong>
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
              className="inlineInput"
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
              className="inlineInput"
            />
          </div>
          <div className="outputRow">
            <span className="outputText">{categories[index].result || ""}</span>
          </div>
        </div>
      ))}

      {totalKeys !== null && (
        <div className="totalRow">
          <strong>
            Total Dragon Keys Needed: {totalKeys.toLocaleString()}
          </strong>
          <img src={DragonKeyIcon} alt="Dragon Key" className="icon" />
        </div>
      )}
    </div>
  );
}
