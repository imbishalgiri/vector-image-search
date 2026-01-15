import { Search } from "lucide-react";
import PillButton from "./PillButton";
import { colors } from "../theme";

const TextSearchInput = ({
  query,
  setQuery,
  handleSearch,
  loading,
}: {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
}) => (
  <>
    <Search color={colors.medium} size={24} style={{ flexShrink: 0 }} />
    <input
      type="text"
      placeholder="Describe the image you want to find..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "1.05rem",
        background: "transparent",
        color: "#333",
        paddingRight: "0.5rem",
        minWidth: 0,
      }}
    />
    <PillButton
      onClick={handleSearch}
      disabled={!query.trim()}
      loading={loading}
    >
      Search
    </PillButton>
  </>
);

export default TextSearchInput;
