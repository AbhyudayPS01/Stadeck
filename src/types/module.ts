/** Identifier for one of the eight challenge-clause modules. */
export type ModuleId =
  | 'navigation'
  | 'crowd-management'
  | 'accessibility'
  | 'transportation'
  | 'sustainability'
  | 'multilingual-assistance'
  | 'operational-intelligence'
  | 'real-time-decision-support';

/** Route and display metadata for a single module, used to drive navigation and routing. */
export interface Module {
  id: ModuleId;
  label: string;
  path: string;
}
