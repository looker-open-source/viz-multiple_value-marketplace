export const PLOT_CONFIG = {
  font_size_main: {
    label: 'Font Size',
    type: 'string',
    section: 'Style',
    default: '',
    order: 0,
    display_size: 'half',
  },
  orientation: {
    label: 'Orientation',
    type: 'string',
    section: 'Style',
    display: 'select',
    values: [
      {Auto: 'auto'},
      {Vertical: 'vertical'},
      {Horizontal: 'horizontal'},
    ],
    default: 'auto',
    order: 0,
    display_size: 'half',
  },
};
