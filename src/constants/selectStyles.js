// Brand colors
const COLORS = {
  primary: '#0468B1',
  primaryHover: '#035a9a',
  primaryLight: '#e0edff',
  primaryDark: '#1e40af',
  border: '#e2e8f0',
  borderHover: '#d1d5db',
  text: '#1e293b',
  background: 'white',
};

/**
 * Base select styles for react-select components
 */
export const baseSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? COLORS.primary : COLORS.border,
    boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.primary}` : 'none',
    '&:hover': {
      borderColor: COLORS.primary,
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? COLORS.primary
      : state.isFocused
        ? COLORS.primaryLight
        : COLORS.background,
    color: state.isSelected ? 'white' : COLORS.text,
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: COLORS.primaryLight,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: COLORS.primaryDark,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: COLORS.primaryDark,
    '&:hover': {
      backgroundColor: COLORS.primary,
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

/**
 * Checkbox option styles for multi-select with checkboxes
 */
export const checkboxSelectStyles = {
  ...baseSelectStyles,
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f0f7ff' : 'white',
    color: COLORS.text,
    cursor: 'pointer',
    padding: '10px 12px',
  }),
};
