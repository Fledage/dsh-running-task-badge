/**
 * Browser half of `dsh-running-task-badge`.
 *
 * Both behaviors are driven by the `shell.overlay` seat's standard
 * `useSessions` hook — the sessions metadata list plus the live
 * `api-session/status` stream the sessions service already subscribes to — so
 * there is no polling and no Harness Client package import:
 *
 *  1. tab badge: while at least one session is running, the page's own
 *     `link[rel~=icon]` hrefs are retargeted to a generated `data:` SVG (the
 *     shipped whale silhouette plus a numbered corner badge), and the same
 *     count is mirrored into `navigator.setAppBadge` where the browser exposes
 *     it. At zero running sessions, and when the seat is disposed, the original
 *     hrefs are restored.
 *  2. completion notice: one system notification per session that leaves the
 *     running set, titled with that session's `displayTitle`.
 *
 * Nothing is painted. The registration exists to own the effects; the overlay
 * layer is click-through, so a null-rendering entry adds no pointer area. The
 * generated artwork uses literal colors on purpose: a favicon is not part of
 * the themed document, so there are no `--dsw-alias-*` tokens to read.
 */
window.__ModuleLoader__.load({
	id: 'dsh-running-task-badge',
	factory(require) {
		const React = require('react');

		const NS = 'running-task-badge';
		/** Artwork accent. A favicon renders outside the page, so it cannot use theme tokens. */
		const BRAND = '#4D6BFE';
		/** Notification tag prefix: several open tabs collapse onto one notice per session. */
		const TAG_PREFIX = 'dsh-running-task-badge:';

		/** Whale silhouette, copied verbatim from the shipped `favicon.svg` (50x50 viewBox). */
		const WHALE_PATH = 'M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z';

		/** Shared empty result: one stable identity, so a zero-count read never invalidates. */
		const EMPTY = [];

		const DICTS = {
			zh: {
				'notify.body': '任务已完成',
			},
			en: {
				'notify.body': 'Task completed',
			},
		};

		function warn(message, error) {
			try {
				if (typeof console === 'undefined') return;
				console.warn(`[running-task-badge] ${message}`, error);
			} catch { /* nothing left to report with */ }
		}

		/** Stand-in translator used only when the seat installed no locale face. */
		function localTranslate(key) {
			const raw = DICTS.zh[key];
			return typeof raw === 'string' ? raw : key;
		}

		/** Durable title, first non-empty of `displayTitle`, `title`, then the id itself. */
		function sessionTitle(summary, id) {
			if (typeof summary.displayTitle === 'string' && summary.displayTitle.length > 0) return summary.displayTitle;
			if (typeof summary.title === 'string' && summary.title.length > 0) return summary.title;
			return id;
		}

		/**
		 * Read the running top-level sessions out of the sessions list state.
		 * Subagent sessions are excluded: one running session is one task.
		 */
		function selectRunning(state) {
			if (state === null || state === undefined || typeof state !== 'object') return EMPTY;
			const ids = Array.isArray(state.ids) ? state.ids : EMPTY;
			const byId = state.byId;
			if (byId === null || byId === undefined || typeof byId !== 'object') return EMPTY;
			const running = [];
			for (const id of ids) {
				const summary = byId[id];
				if (summary === null || summary === undefined || typeof summary !== 'object') continue;
				if (summary.running !== true) continue;
				if (summary.origin === 'subagent') continue;
				running.push({ id, title: sessionTitle(summary, id) });
			}
			return running.length === 0 ? EMPTY : running;
		}

		/** Keep the hook result referentially stable while the running set is unchanged. */
		function equalRunning(left, right) {
			if (left === right) return true;
			if (left.length !== right.length) return false;
			for (let index = 0; index < left.length; index++) {
				if (left[index].id !== right[index].id) return false;
				if (left[index].title !== right[index].title) return false;
			}
			return true;
		}

		function noRunningSessions() {
			return EMPTY;
		}

		/** Subscribe to the smallest slice the effects need, tolerating a missing hook source. */
		function useRunningSessions(hook) {
			const source = typeof hook === 'function' ? hook : noRunningSessions;
			return source(selectRunning, equalRunning);
		}

		/* ------------------------------------------------------------------ *
		 * Generated artwork
		 * ------------------------------------------------------------------ */

		function svgDocument(body) {
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">${body}</svg>`;
			return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
		}

		/** Notification thumbnail: the plain whale, legible on light and dark surfaces alike. */
		const APP_ICON = svgDocument(`<path d="${WHALE_PATH}" fill="${BRAND}" fill-rule="nonzero"/>`);

		/** Favicon: whale plus a numbered corner badge, sized so one digit stays legible at 16px. */
		function badgeIcon(count) {
			const text = count > 99 ? '99+' : String(count);
			const fontSize = text.length >= 3 ? 13 : text.length === 2 ? 18 : 22;
			return svgDocument(
				`<path d="${WHALE_PATH}" fill="${BRAND}" fill-rule="nonzero"/>`
				+ `<circle cx="35.5" cy="35.5" r="13" fill="${BRAND}" stroke="#ffffff" stroke-width="2.5"/>`
				+ `<text x="35.5" y="35.5" text-anchor="middle" dominant-baseline="central"`
				+ ` font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif"`
				+ ` font-size="${fontSize}" font-weight="600" fill="#ffffff">${text}</text>`,
			);
		}

		/* ------------------------------------------------------------------ *
		 * Tab badge
		 * ------------------------------------------------------------------ */

		/** Each icon link we retargeted, mapped to the href it had beforehand. */
		const retargetedIcons = new Map();

		/** Prefixed onto every generated href, so our own writes are never mistaken for originals. */
		const DATA_PREFIX = 'data:image/svg+xml;charset=utf-8,';

		function applyBadge(count) {
			if (typeof document === 'undefined') return;
			if (count <= 0) {
				restoreIcons();
				applyAppBadge(0);
				return;
			}
			const links = Array.from(document.querySelectorAll('link[rel~="icon"]'));
			if (links.length === 0) return;
			const url = badgeIcon(count);
			for (const element of links) {
				if (!retargetedIcons.has(element)) {
					const href = element.getAttribute('href');
					// Skip any href we already wrote, so a re-query can never adopt our
					// own artwork as the "original" it should restore later.
					if (typeof href === 'string' && href.startsWith(DATA_PREFIX)) continue;
					retargetedIcons.set(element, href);
				}
				element.setAttribute('href', url);
			}
			applyAppBadge(count);
		}

		/** Put every retargeted icon back, and clear the undo journal. */
		function restoreIcons() {
			if (retargetedIcons.size === 0) return;
			for (const [element, href] of retargetedIcons) {
				if (!element.isConnected) continue;
				if (typeof href === 'string') element.setAttribute('href', href);
				else element.removeAttribute('href');
			}
			retargetedIcons.clear();
		}

		/**
		 * Mirror the count into the installed-app badge where the browser has one.
		 * Absent, unsupported, or refused are all normal: the favicon still shows it.
		 */
		function applyAppBadge(count) {
			try {
				const nav = typeof navigator === 'undefined' ? void 0 : navigator;
				if (nav === void 0) return;
				if (count > 0) {
					if (typeof nav.setAppBadge !== 'function') return;
					const result = nav.setAppBadge(count);
					if (result !== null && result !== undefined && typeof result.catch === 'function') result.catch(() => {});
					return;
				}
				if (typeof nav.clearAppBadge !== 'function') return;
				const result = nav.clearAppBadge();
				if (result !== null && result !== undefined && typeof result.catch === 'function') result.catch(() => {});
			} catch (error) {
				warn('app badge unavailable', error);
			}
		}

		/* ------------------------------------------------------------------ *
		 * Completion notices
		 * ------------------------------------------------------------------ */

		/** Armed one-shot permission listeners, so teardown can always remove them. */
		const permissionListeners = new Set();

		function detachPermissionListeners() {
			if (typeof document === 'undefined') return;
			for (const [name, handler] of permissionListeners) document.removeEventListener(name, handler);
			permissionListeners.clear();
		}

		/**
		 * Ask for notification permission on the user's next interaction.
		 * A prompt at page load, before any work exists, is noise, and browsers
		 * honour a request far more reliably from a real gesture. Contextual too:
		 * this is only armed once a task is actually running.
		 * Idempotent, so it is safe to call on every running-count change.
		 */
		function armPermissionRequest() {
			if (typeof document === 'undefined' || typeof Notification === 'undefined') return;
			if (Notification.permission !== 'default') return;
			if (permissionListeners.size > 0) return;
			const handler = () => {
				detachPermissionListeners();
				requestPermission();
			};
			for (const name of ['pointerdown', 'keydown']) {
				document.addEventListener(name, handler);
				permissionListeners.add([name, handler]);
			}
		}

		/** One permission request per arming; a refusal only disables notices, never the badge. */
		function requestPermission() {
			if (typeof Notification === 'undefined') return;
			try {
				const result = Notification.requestPermission();
				if (result !== null && result !== undefined && typeof result.catch === 'function') result.catch(() => {});
			} catch (error) {
				warn('notification permission request failed', error);
			}
		}

		function notify(t, id, title) {
			if (typeof Notification === 'undefined') return;
			if (Notification.permission !== 'granted') return;
			// The task name is the headline and "任务已完成" is the body, so several
			// finished tasks read as a scannable list in the notification centre.
			const name = typeof title === 'string' && title.length > 0 ? title : id;
			try {
				// One tag per session, so several open tabs collapse onto one notice.
				// eslint-disable-next-line no-new
				new Notification(name, {
					body: t('notify.body'),
					icon: APP_ICON,
					tag: TAG_PREFIX + id,
					renotify: true,
				});
			} catch (error) {
				warn('notification failed', error);
			}
		}

		/* ------------------------------------------------------------------ *
		 * Seat
		 * ------------------------------------------------------------------ */

		/**
		 * Render-nothing seat that owns the two effects.
		 * @param props - composed slot props: `useSessions` from the root standard binding, `t` from the locale seat.
		 * @returns nothing; every visible result of this plugin is browser chrome.
		 */
		function RunningTaskBadge(props) {
			const t = typeof props.t === 'function' ? props.t : localTranslate;
			const running = useRunningSessions(props.useSessions);
			const count = running.length;
			const titles = React.useRef(null);
			if (titles.current === null) titles.current = new Map();
			const previousIds = React.useRef(null);

			// Favicon, app badge, and the permission gesture arm all follow the running count.
			React.useEffect(() => {
				applyBadge(count);
				if (count > 0) armPermissionRequest();
			}, [count]);

			React.useEffect(() => () => {
				detachPermissionListeners();
				restoreIcons();
				applyAppBadge(0);
			}, []);

			// Remember titles while sessions run: a finishing session may leave the
			// latest-summary state behind, and the notice still needs its name.
			React.useEffect(() => {
				const remembered = titles.current;
				const ids = [];
				for (const item of running) {
					remembered.set(item.id, item.title);
					ids.push(item.id);
				}
				const before = previousIds.current;
				previousIds.current = ids;
				const live = new Set(ids);
				// The first snapshot only establishes a baseline; sessions already
				// running when the page opened must not announce themselves.
				if (before !== null) {
					for (const id of before) {
						if (live.has(id)) continue;
						const title = remembered.get(id);
						notify(t, id, typeof title === 'string' && title.length > 0 ? title : id);
					}
				}
				// Forget stopped sessions, so the map stays the running set.
				for (const id of Array.from(remembered.keys())) {
					if (!live.has(id)) remembered.delete(id);
				}
			}, [running, t]);

			return null;
		}

		return {
			inject: ['slots', 'locale'],
			apply(ctx) {
				ctx.effect(() => ctx.locale.register(NS, DICTS), 'running-task-badge: dictionaries');
				ctx.slots.inject('shell.overlay', () => ctx.slots.register({
					name: 'shell.overlay',
					id: 'running-task-badge.watch',
					order: 500,
					locale: NS,
				}, RunningTaskBadge));
			},
		};
	},
});
