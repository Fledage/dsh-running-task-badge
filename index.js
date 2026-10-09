/**
 * Host half of the `dsh-running-task-badge` bundle.
 *
 * Intentionally empty: both behaviors (the tab badge and the completion notice)
 * are browser chrome driven by the Client half in `./client.js`, which the
 * loader mounts into the `shell.overlay` seat. This row exists so the bundle has
 * a Host row to attach its Client module to.
 */
export function apply() {}
