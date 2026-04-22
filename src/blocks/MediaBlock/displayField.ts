import type { Field } from 'payload'

/** Shared with Two column → Media so behaviour matches the page Media block. */
export const mediaBlockDisplayField: Field = {
  name: 'display',
  type: 'select',
  label: 'Display',
  defaultValue: 'all',
  options: [
    { label: 'Mobile + Desktop', value: 'all' },
    { label: 'Mobile only', value: 'mobile' },
    { label: 'Desktop only', value: 'desktop' },
  ],
}
