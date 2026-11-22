// What each dashboard screen edits. Each editor maps to one row of the site_settings table.
import { PROMO_SLOTS } from '@/lib/promoSlots';

const ALIGN = [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']];
const COLS = (max = 6) => Array.from({ length: max }, (_, i) => [i + 1, `${i + 1} per row`]);
const BTN_STYLES = [['dark', 'Dark (filled)'], ['outline', 'Outline'], ['green', 'Green'], ['white', 'White (for dark backgrounds)'], ['ghost', 'Ghost (for dark backgrounds)']];

const buttonItem = [
  { k: 'label', label: 'Button text', half: true },
  { k: 'href', type: 'link', label: 'Goes to', half: true },
  { k: 'style', type: 'select', label: 'Style', options: BTN_STYLES, half: true },
  { k: 'new_tab', type: 'toggle', label: 'Open in a new tab' },
];
export const buttonsField = (k = 'buttons', label = 'Buttons') => ({
  k, type: 'list', label, addLabel: 'Add button', item: buttonItem, itemTitle: (b) => b.label, newItem: () => ({ label: 'New button', href: '/', style: 'dark' }),
});

const linkItem = [{ k: 'label', label: 'Text', half: true }, { k: 'href', type: 'link', label: 'Goes to (leave empty for plain text)', half: true }];

const productItem = [
  { k: 'kind', type: 'select', label: 'Card type', options: [['product', 'Product card (image, price, + button)'], ['coming_soon', 'Coming-soon card (dashed box)']] },
  { k: 'name', label: 'Name', half: true },
  { k: 'badge', label: 'Badge (e.g. Digital, New)', half: true, show: (v) => v.kind === 'product' },
  { k: 'icon', label: 'Emoji / icon (used when there is no image)', half: true },
  { k: 'price', label: 'Price (e.g. ₹299)', half: true },
  { k: 'image_url', type: 'image', label: 'Image' },
  { k: 'desc', type: 'rich', label: 'Description', rows: 2 },
  { k: 'href', type: 'link', label: 'Link (for the + button)', show: (v) => v.kind === 'product' },
];
const productsField = (k = 'items') => ({ k, type: 'list', label: 'Products / cards', addLabel: 'Add card', item: productItem, itemTitle: (x) => x.name, newItem: () => ({ kind: 'product', name: 'New product', icon: '🌱', badge: '', price: '', desc: '', href: '/shop', image_url: '' }) });

export const BLOCK_TYPES = [
  ['text', 'Text section (heading, paragraphs, buttons)'],
  ['image', 'Image / banner'],
  ['cards', 'Cards grid'],
  ['cta', 'Dark call-to-action banner'],
  ['faq', 'FAQ (questions & answers)'],
  ['ask', 'Ask-a-question form'],
  ['promo', 'Promotion slot'],
  ['html', 'Custom HTML / embed (YouTube, map, form…)'],
  ['spacer', 'Empty space'],
];

export const blockFields = [
  { k: 'type', type: 'select', label: 'Block type', options: BLOCK_TYPES },
  { k: 'eyebrow', label: 'Small label above the heading', show: (b) => ['text', 'cards', 'cta', 'faq', 'ask'].includes(b.type) },
  { k: 'heading', type: 'rich', rows: 2, label: 'Heading', show: (b) => ['text', 'image', 'cards', 'cta', 'faq', 'ask'].includes(b.type) },
  { k: 'body', type: 'rich', rows: 6, label: 'Text (leave a blank line between paragraphs)', show: (b) => ['text', 'cards', 'cta', 'ask'].includes(b.type) },
  { k: 'image_url', type: 'image', label: 'Image', show: (b) => b.type === 'image' },
  { k: 'alt', label: 'Image description (for Google & screen readers)', show: (b) => b.type === 'image' },
  { k: 'href', type: 'link', label: 'Image links to', show: (b) => b.type === 'image' },
  { k: 'caption', label: 'Caption', show: (b) => b.type === 'image' },
  { ...buttonsField(), show: (b) => ['text', 'cta'].includes(b.type) },
  { k: 'columns', type: 'select', numeric: true, label: 'Cards per row', options: COLS(4), show: (b) => b.type === 'cards' },
  {
    k: 'items', type: 'list', label: 'Items', addLabel: 'Add item', show: (b) => ['cards', 'faq'].includes(b.type),
    item: [{ k: 'title', label: 'Title / question' }, { k: 'text', type: 'rich', label: 'Text / answer', rows: 3 }, { k: 'icon', label: 'Emoji (cards)', half: true }, { k: 'href', type: 'link', label: 'Link (cards)', half: true }, { k: 'image_url', type: 'image', label: 'Image (cards)' }],
    newItem: () => ({ title: 'New item', text: '' }),
  },
  { k: 'slot', type: 'select', label: 'Which promotion slot', options: [...PROMO_SLOTS.map((s) => [s.id, s.label]), ['custom_1', 'Custom slot 1'], ['custom_2', 'Custom slot 2'], ['custom_3', 'Custom slot 3']], show: (b) => b.type === 'promo' },
  { k: 'html', type: 'code', label: 'HTML code', help: 'Paste embed code here (e.g. a YouTube or Google Maps embed). Only you can edit this.', show: (b) => b.type === 'html' },
  { k: 'height', type: 'number', label: 'Height in pixels', show: (b) => b.type === 'spacer' },
  { k: 'anchor', label: 'Anchor name (so buttons can link to #name)', show: (b) => b.type === 'ask' },
  { type: 'heading', label: 'Look', show: (b) => !['promo'].includes(b.type) },
  { k: 'align', type: 'select', label: 'Text alignment', options: ALIGN, half: true, show: (b) => ['text', 'image', 'cards'].includes(b.type) },
  { k: 'width', type: 'select', label: 'Width', options: [['wide', 'Wide'], ['narrow', 'Narrow (reading width)']], half: true, show: (b) => ['text', 'image', 'cards', 'html'].includes(b.type) },
  { k: 'padding', type: 'select', label: 'Spacing', options: [['normal', 'Normal'], ['compact', 'Compact'], ['roomy', 'Roomy']], half: true, show: (b) => !['promo', 'spacer', 'cta'].includes(b.type) },
  { k: 'background', type: 'color', label: 'Background colour', show: (b) => b.type !== 'promo' },
  { k: 'text_color', type: 'color', label: 'Text colour', show: (b) => ['text', 'cards', 'image', 'html'].includes(b.type) },
];
export const newBlock = () => ({ type: 'text', heading: 'New section', body: '', align: 'left', width: 'wide', padding: 'normal', buttons: [], items: [] });

export const EDITORS = {
  brand: {
    title: 'Logo & brand', preview: '/',
    intro: 'Your logo appears in the top menu and in the footer. Upload a new file or paste a link. PNG with a transparent background works best.',
    fields: [
      { k: 'logo_url', type: 'image', label: 'Main logo (top menu)' },
      { k: 'logo_height', type: 'number', label: 'Logo height in the menu (pixels)', min: 16, max: 60, half: true },
      { k: 'logo_alt', label: 'Logo description (for Google)', half: true },
      { k: 'footer_logo_url', type: 'image', label: 'Footer logo (leave empty to use the main logo)', help: 'The footer is dark green, so a light/white version of the logo can look better here.' },
      { k: 'footer_logo_height', type: 'number', label: 'Footer logo height (pixels)', min: 16, max: 80 },
      { k: 'favicon_url', type: 'image', label: 'Browser tab icon (favicon)', help: 'A small square image (e.g. 64×64 PNG). Leave empty to keep the current one.' },
      { k: 'site_name', label: 'Site name' },
    ],
  },

  theme: {
    title: 'Colours & fonts', preview: '/',
    intro: 'Change the colours used across the whole website. Leave a colour as it is to keep the current look.',
    fields: [
      { type: 'heading', label: 'Greens (brand)' },
      { k: 'colors', type: 'object', label: '', fields: [
        { k: 'g-dark', type: 'color', label: 'Dark green (footer, banners, testimonials)' },
        { k: 'g-mid', type: 'color', label: 'Mid green (links, accents)' },
        { k: 'g-base', type: 'color', label: 'Base green' },
        { k: 'g-light', type: 'color', label: 'Light green (borders)' },
        { k: 'g-pale', type: 'color', label: 'Pale green (hover backgrounds)' },
        { k: 'g-faint', type: 'color', label: 'Faint green (soft boxes)' },
        { k: 'ink', type: 'color', label: 'Main text / dark buttons' },
        { k: 'ink-2', type: 'color', label: 'Text 2' },
        { k: 'ink-3', type: 'color', label: 'Body text (grey-green)' },
        { k: 'ink-4', type: 'color', label: 'Muted text' },
        { k: 'surface', type: 'color', label: 'Section background (off-white)' },
        { k: 'white', type: 'color', label: 'White background' },
        { k: 'rule', type: 'color', label: 'Lines & borders' },
        { k: 'amber', type: 'color', label: 'Amber accent (NEW tags)' },
        { k: 'amber-bg', type: 'color', label: 'Amber background' },
      ] },
      { type: 'heading', label: 'Fonts & shape' },
      { k: 'heading_font', type: 'select', label: 'Heading font', options: [['DM Serif Display', 'DM Serif Display (current)'], ['Playfair Display', 'Playfair Display'], ['Lora', 'Lora'], ['Merriweather', 'Merriweather'], ['Fraunces', 'Fraunces'], ['Poppins', 'Poppins'], ['Montserrat', 'Montserrat'], ['Inter', 'Inter']], half: true },
      { k: 'body_font', type: 'select', label: 'Body font', options: [['Inter', 'Inter (current)'], ['Poppins', 'Poppins'], ['Open Sans', 'Open Sans'], ['Lato', 'Lato'], ['Nunito', 'Nunito'], ['Source Sans 3', 'Source Sans 3']], half: true },
      { k: 'radius', type: 'number', label: 'Corner roundness of cards (pixels)', min: 0, max: 40 },
      { k: 'custom_css', type: 'code', label: 'Custom CSS (advanced)', help: 'Optional. Any CSS written here is added to every page.' },
    ],
  },

  nav: {
    title: 'Top menu (tabs)', preview: '/',
    intro: 'Rename, reorder (↑ ↓), hide or add tabs. A tab whose page is switched off under “Pages on/off” disappears automatically.',
    fields: [
      { k: 'items', type: 'list', label: 'Tabs, in order', addLabel: 'Add tab', item: [
        { k: 'label', label: 'Tab name', half: true },
        { k: 'href', type: 'link', label: 'Goes to', half: true },
        { k: 'new_tab', type: 'toggle', label: 'Open in a new browser tab' },
      ], itemTitle: (x) => `${x.label}  →  ${x.href || ''}`, newItem: () => ({ label: 'New tab', href: '/' }) },
      { type: 'heading', label: 'Button on the right of the menu' },
      { k: 'cta', type: 'object', fields: [
        { k: 'enabled', type: 'toggle', label: 'Show the button' },
        { k: 'label', label: 'Button text', half: true },
        { k: 'href', type: 'link', label: 'Goes to', half: true },
      ] },
    ],
  },

  hero: {
    title: 'Hero (top of home page)', preview: '/',
    fields: [
      { k: 'eyebrow', label: 'Small label above the headline' },
      { k: 'title', type: 'rich', rows: 3, label: 'Headline' },
      { k: 'lead', type: 'rich', rows: 3, label: 'Text under the headline' },
      buttonsField(),
      { k: 'stats_enabled', type: 'toggle', label: 'Show the numbers row' },
      { k: 'stats', type: 'list', label: 'Numbers', show: (v) => v.stats_enabled, addLabel: 'Add number', noToggle: true, item: [{ k: 'value', label: 'Number', half: true }, { k: 'label', label: 'Label', half: true }], itemTitle: (x) => `${x.value} ${x.label}`, newItem: () => ({ value: '0', label: 'Label' }) },
      { type: 'heading', label: 'Featured card (right side)' },
      { k: 'featured', type: 'object', fields: [
        { k: 'enabled', type: 'toggle', label: 'Show the featured card' },
        { k: 'mode', type: 'select', label: 'Content', options: [['custom', 'Write my own text'], ['post', 'Use an article (title & summary pulled in automatically)']] },
        { k: 'post_slug', type: 'post', label: 'Article to feature', show: (v) => v.mode === 'post' },
        { k: 'chip', label: 'Tag (e.g. 🌱 Featured Guide)' },
        { k: 'title', label: 'Title', show: (v) => v.mode !== 'post' },
        { k: 'text', type: 'textarea', label: 'Text', show: (v) => v.mode !== 'post' },
        { k: 'href', type: 'link', label: 'Button goes to', show: (v) => v.mode !== 'post' },
        { k: 'button_label', label: 'Button text' },
        { k: 'image_url', type: 'image', label: 'Image (optional)' },
      ] },
      { k: 'small_cards_enabled', type: 'toggle', label: 'Show the two small cards' },
      { k: 'small_cards', type: 'list', label: 'Small cards', show: (v) => v.small_cards_enabled, addLabel: 'Add card', item: [
        { k: 'chip', label: 'Tag', half: true }, { k: 'chip_style', type: 'select', label: 'Tag colour', options: [['green', 'Green'], ['amber', 'Amber']], half: true },
        { k: 'title', label: 'Title', half: true }, { k: 'sub', label: 'Sub-text', half: true }, { k: 'icon', label: 'Emoji', half: true }, { k: 'href', type: 'link', label: 'Link (optional)', half: true },
      ], newItem: () => ({ chip: 'Trending', chip_style: 'green', title: 'Title', sub: '', icon: '🌱', href: '' }) },
      { type: 'heading', label: 'Look' },
      { k: 'text_align', type: 'select', label: 'Text alignment', options: ALIGN, half: true },
      { k: 'background', type: 'color', label: 'Background colour' },
      { k: 'background_image', type: 'image', label: 'Background image (optional)' },
    ],
  },

  ticker: {
    title: 'Scrolling topics strip', preview: '/',
    fields: [
      { k: 'items', type: 'tags', label: 'Topics (one per line)' },
      { k: 'speed_seconds', type: 'number', label: 'Seconds for one full scroll (lower = faster)', min: 5, max: 120 },
      { k: 'background', type: 'color', label: 'Background colour' },
    ],
  },

  pillars: {
    title: 'Six pillars', preview: '/',
    intro: 'Edit the titles, text, icons or images, the order, and the layout of the pillar cards. You can have more or fewer than six.',
    fields: [
      { k: 'eyebrow', label: 'Small label', half: true },
      { k: 'header_align', type: 'select', label: 'Heading alignment', options: ALIGN, half: true },
      { k: 'title', type: 'rich', rows: 2, label: 'Heading' },
      { k: 'subtitle', type: 'rich', rows: 2, label: 'Text under the heading' },
      { k: 'items', type: 'list', label: 'Pillars, in order', addLabel: 'Add pillar', item: [
        { k: 'title', label: 'Title', half: true }, { k: 'icon', label: 'Emoji / icon', half: true },
        { k: 'desc', type: 'rich', rows: 2, label: 'Description' },
        { k: 'image_url', type: 'image', label: 'Image (shown when “Picture style” uses images)' },
        { k: 'href', type: 'link', label: 'Card links to', half: true }, { k: 'link_label', label: 'Link text', half: true },
      ], newItem: () => ({ title: 'New pillar', icon: '🌿', desc: '', href: '/blog', link_label: 'Explore', image_url: '' }) },
      { type: 'heading', label: 'Layout & presentation' },
      { k: 'columns', type: 'select', numeric: true, label: 'Cards per row (desktop)', options: COLS(6), half: true },
      { k: 'layout', type: 'select', label: 'Card style', options: [['joined', 'Joined grid with thin lines (current)'], ['cards', 'Separate cards with gaps']], half: true },
      { k: 'media', type: 'select', label: 'Picture style', options: [['icon', 'Emoji icon'], ['image', 'Image'], ['both', 'Image and emoji'], ['none', 'No picture']], half: true },
      { k: 'image_height', type: 'number', label: 'Image height (pixels)', half: true, show: (v) => v.media === 'image' || v.media === 'both' },
      { k: 'icon_size', type: 'number', label: 'Emoji size (1.6 = current)', step: 0.1, half: true },
      { k: 'text_align', type: 'select', label: 'Text alignment in cards', options: ALIGN, half: true },
      { k: 'padding', type: 'select', label: 'Inner spacing', options: [['compact', 'Compact'], ['normal', 'Normal (current)'], ['roomy', 'Roomy']], half: true },
      { k: 'indent', type: 'number', label: 'Extra left indent (pixels)', min: 0, max: 80, half: true },
      { k: 'show_link', type: 'toggle', label: 'Show the “Explore →” link' },
      { k: 'background', type: 'color', label: 'Section background' },
      { k: 'card_background', type: 'color', label: 'Card background' },
    ],
  },

  latest: {
    title: 'Featured articles on home page', preview: '/',
    intro: 'Choose which articles appear first on the home page. “Hand-picked” shows your chosen articles in your order; the newest articles can fill any remaining spaces.',
    fields: [
      { k: 'mode', type: 'select', label: 'Which articles', options: [['latest', 'Newest articles automatically'], ['manual', 'Hand-picked, in my order']] },
      { k: 'featured_slugs', type: 'posts', label: 'Hand-picked articles (first one is shown large)', show: (v) => v.mode === 'manual' },
      { k: 'fill_with_latest', type: 'toggle', label: 'Fill remaining spaces with the newest articles', show: (v) => v.mode === 'manual' },
      { k: 'count', type: 'number', label: 'How many articles to show', min: 1, max: 24, half: true },
      { k: 'layout', type: 'select', label: 'Layout', options: [['magazine', 'Magazine (1 large + 2 side + row)'], ['grid', 'Even grid']], half: true },
      { k: 'show_excerpt', type: 'toggle', label: 'Show the short summary on each card' },
      { k: 'eyebrow', label: 'Small label', half: true },
      { k: 'title', type: 'rich', rows: 1, label: 'Heading', half: true },
      { k: 'button_label', label: 'Button text', half: true },
      { k: 'button_href', type: 'link', label: 'Button goes to', half: true },
      { k: 'author_label', label: 'Author name on cards' },
      { k: 'background', type: 'color', label: 'Background colour' },
    ],
  },

  philosophy: {
    title: 'Our Philosophy', preview: '/',
    fields: [
      { k: 'eyebrow', label: 'Small label', half: true },
      { k: 'header_align', type: 'select', label: 'Heading alignment', options: ALIGN, half: true },
      { k: 'title', type: 'rich', rows: 2, label: 'Heading' },
      { k: 'subtitle', type: 'rich', rows: 2, label: 'Text under the heading' },
      { k: 'items', type: 'list', label: 'Principles, in order', addLabel: 'Add principle', item: [
        { k: 'title', label: 'Title', half: true }, { k: 'num', label: 'Number (e.g. 01 — leave empty to number automatically)', half: true },
        { k: 'icon', label: 'Emoji (optional)' }, { k: 'text', type: 'rich', rows: 3, label: 'Text' },
      ], newItem: () => ({ title: 'New principle', num: '', icon: '', text: '' }) },
      { type: 'heading', label: 'Layout' },
      { k: 'columns', type: 'select', numeric: true, label: 'Boxes per row', options: COLS(4), half: true },
      { k: 'text_align', type: 'select', label: 'Text alignment', options: ALIGN, half: true },
      { k: 'show_numbers', type: 'toggle', label: 'Show the numbers (01, 02…)' },
      { k: 'background', type: 'color', label: 'Section background' },
      { k: 'card_background', type: 'color', label: 'Box background' },
    ],
  },

  testimonials: {
    title: 'What Our Readers Say', preview: '/',
    intro: 'Please only publish genuine reader quotes, with their permission.',
    fields: [
      { k: 'eyebrow', label: 'Small label' },
      { k: 'title', type: 'rich', rows: 2, label: 'Heading' },
      { k: 'items', type: 'list', label: 'Testimonials, in order', addLabel: 'Add testimonial', item: [
        { k: 'name', label: 'Name', half: true }, { k: 'role', label: 'Role & city', half: true },
        { k: 'text', type: 'textarea', rows: 4, label: 'Quote' },
        { k: 'stars', type: 'select', numeric: true, label: 'Stars', options: [[5, '★★★★★'], [4, '★★★★'], [3, '★★★'], [0, 'No stars']], half: true },
        { k: 'photo_url', type: 'image', label: 'Photo (optional — otherwise the first letter is shown)' },
      ], itemTitle: (x) => x.name, newItem: () => ({ name: 'Reader name', role: '', text: '', stars: 5, photo_url: '' }) },
      { k: 'columns', type: 'select', numeric: true, label: 'Per row', options: COLS(4), half: true },
      { k: 'show_stars', type: 'toggle', label: 'Show stars' },
      { k: 'background', type: 'color', label: 'Background colour (default dark green)' },
      { k: 'text_color', type: 'color', label: 'Heading colour' },
    ],
  },

  store: {
    title: 'Organik Greens Store section', preview: '/',
    intro: 'The store preview on the home page. When “Follow the Shop page” is on, this section disappears automatically when you switch the Shop page off.',
    fields: [
      { k: 'follow_shop_page', type: 'toggle', label: 'Follow the Shop page (hide this when the Shop is off)' },
      { k: 'show_banner', type: 'toggle', label: 'Show the dark banner' },
      { k: 'eyebrow', label: 'Small label', show: (v) => v.show_banner },
      { k: 'title', type: 'rich', rows: 1, label: 'Banner heading', show: (v) => v.show_banner },
      { k: 'text', type: 'rich', rows: 2, label: 'Banner text', show: (v) => v.show_banner },
      { k: 'button_label', label: 'Banner button text', half: true, show: (v) => v.show_banner },
      { k: 'button_href', type: 'link', label: 'Banner button goes to', half: true, show: (v) => v.show_banner },
      { k: 'banner_background', type: 'color', label: 'Banner colour', show: (v) => v.show_banner },
      { k: 'show_items', type: 'toggle', label: 'Show the product cards' },
      { ...productsField(), show: (v) => v.show_items },
    ],
  },

  ask: {
    title: 'Ask-a-question section', preview: '/#ask',
    fields: [{ k: 'eyebrow', label: 'Small label' }, { k: 'heading', label: 'Heading' }, { k: 'intro', type: 'rich', rows: 3, label: 'Text' }],
  },

  cta: {
    title: 'Closing banner (home page)', preview: '/',
    fields: [{ k: 'eyebrow', label: 'Small label' }, { k: 'heading', type: 'rich', rows: 2, label: 'Heading' }, { k: 'text', type: 'rich', rows: 3, label: 'Text' }, buttonsField(), { k: 'background', type: 'color', label: 'Background colour' }],
  },

  footer: {
    title: 'Footer', preview: '/',
    intro: 'Everything at the bottom of every page. The “Topics” column lists your blog categories automatically; other columns are links you control. Links to pages you switch off are removed automatically.',
    fields: [
      { k: 'show_logo', type: 'toggle', label: 'Show the logo' },
      { k: 'description', type: 'rich', rows: 3, label: 'Short description under the logo' },
      { k: 'socials', type: 'list', label: 'Social icons', addLabel: 'Add social link', item: [
        { k: 'label', label: 'Name (e.g. Instagram)', half: true }, { k: 'icon', label: 'Icon (emoji or letter)', half: true }, { k: 'url', label: 'Link (e.g. https://instagram.com/organikgreens)' },
      ], itemTitle: (x) => `${x.icon} ${x.label}${x.url ? '' : ' (no link yet)'}`, newItem: () => ({ label: 'New', icon: '🔗', url: '' }) },
      { k: 'columns', type: 'list', label: 'Link columns', addLabel: 'Add column', item: [
        { k: 'title', label: 'Column heading', half: true },
        { k: 'source', type: 'select', label: 'Links', options: [['custom', 'My own links'], ['categories', 'Blog categories (automatic)']], half: true },
        { k: 'links', type: 'list', label: 'Links', show: (v) => v.source !== 'categories', addLabel: 'Add link', noToggle: true, item: linkItem, itemTitle: (x) => `${x.label}${x.href ? `  →  ${x.href}` : '  (no link)'}`, newItem: () => ({ label: 'New link', href: '' }) },
      ], itemTitle: (x) => x.title, newItem: () => ({ title: 'New column', source: 'custom', links: [] }) },
      { type: 'heading', label: 'Contact details' },
      { k: 'contact', type: 'object', fields: [
        { k: 'enabled', type: 'toggle', label: 'Show contact details (under the last column)' },
        { k: 'title', label: 'Heading', half: true }, { k: 'email', label: 'Email', half: true }, { k: 'phone', label: 'Phone', half: true },
      ] },
      { type: 'heading', label: 'Bottom line' },
      { k: 'copyright', label: 'Copyright text', help: '{year} is replaced with the current year automatically.' },
      { k: 'tagline', label: 'Right-hand text' },
      { k: 'background', type: 'color', label: 'Footer background (default: dark ink)' },
      { k: 'text_color', type: 'color', label: 'Footer text colour' },
    ],
  },

  categories: {
    title: 'Blog categories', preview: '/blog',
    intro: 'The categories used in the blog filter, on article cards and in the footer. The “slug” must match the category saved on your articles.',
    fields: [
      { k: 'all_label', label: 'Name of the “all” filter' },
      { k: 'items', type: 'list', label: 'Categories, in order', addLabel: 'Add category', noToggle: true, item: [{ k: 'label', label: 'Name', half: true }, { k: 'slug', label: 'Slug (e.g. organic-farming)', half: true }], itemTitle: (x) => `${x.label}  (${x.slug})`, newItem: () => ({ label: 'New category', slug: 'new-category' }) },
    ],
  },

  blog_page: {
    title: 'Blog page', preview: '/blog',
    fields: [
      { k: 'eyebrow', label: 'Small label' },
      { k: 'title', type: 'rich', rows: 1, label: 'Heading' },
      { k: 'subtitle', type: 'rich', rows: 2, label: 'Text under the heading' },
      { k: 'show_filters', type: 'toggle', label: 'Show the category filter buttons' },
      { k: 'pinned_slugs', type: 'posts', label: 'Pinned articles (shown first on the blog page, in this order)' },
      { k: 'author_label', label: 'Author name on cards' },
      { k: 'empty_text', label: 'Text when a category has no articles' },
      { type: 'heading', label: 'Search engines' },
      { k: 'seo_title', label: 'Page title in Google' },
      { k: 'seo_description', type: 'textarea', label: 'Description in Google' },
    ],
  },

  article: {
    title: 'Article pages (all articles)', preview: '/blog/organic-guide',
    fields: [
      { k: 'back_label', label: '“Back to blog” link text (empty = hide)' },
      { k: 'author_label', label: 'Author name (empty = hide)' },
      { k: 'show_year', type: 'toggle', label: 'Show the year' },
      { k: 'show_summary', type: 'toggle', label: 'Show the summary box' },
      { k: 'summary_label', label: 'Summary box title', show: (v) => v.show_summary },
      { k: 'show_ask_box', type: 'toggle', label: 'Show the question box at the end' },
    ],
  },

  shop_page: {
    title: 'Shop page', preview: '/shop',
    fields: [
      { k: 'eyebrow', label: 'Small label' }, { k: 'title', type: 'rich', rows: 1, label: 'Heading' }, { k: 'subtitle', type: 'rich', rows: 2, label: 'Text under the heading' },
      { k: 'notice_title', label: 'Notice heading' }, { k: 'notice_text', type: 'rich', rows: 3, label: 'Notice text' },
      productsField(),
      { type: 'heading', label: 'Enquiry form' },
      { k: 'ask_enabled', type: 'toggle', label: 'Show the enquiry form' },
      { k: 'ask_eyebrow', label: 'Small label', show: (v) => v.ask_enabled }, { k: 'ask_heading', label: 'Heading', show: (v) => v.ask_enabled },
      { k: 'ask_intro', type: 'rich', rows: 2, label: 'Text', show: (v) => v.ask_enabled }, { k: 'ask_placeholder', label: 'Example text in the box', show: (v) => v.ask_enabled },
      { type: 'heading', label: 'Search engines' }, { k: 'seo_title', label: 'Page title in Google' }, { k: 'seo_description', type: 'textarea', label: 'Description in Google' },
    ],
  },

  about: {
    title: 'About page', preview: '/about',
    fields: [
      { type: 'heading', label: 'Top of page' },
      { k: 'eyebrow', label: 'Small label' }, { k: 'title', type: 'rich', rows: 2, label: 'Headline' }, { k: 'lead', type: 'rich', rows: 3, label: 'Intro text' },
      { k: 'button_label', label: 'Button text', half: true }, { k: 'button_href', type: 'link', label: 'Button goes to', half: true },
      { k: 'hero_image', type: 'image', label: 'Picture on the right (optional)' }, { k: 'hero_icon', label: 'Emoji shown when there is no picture', half: true },
      { k: 'badge_value', label: 'Badge number', half: true }, { k: 'badge_label', label: 'Badge label', half: true },
      { type: 'heading', label: 'Story' },
      { k: 'quote', type: 'rich', rows: 2, label: 'Quote box' }, { k: 'why_title', label: 'Story heading' }, { k: 'why_text', type: 'rich', rows: 8, label: 'Story text (blank line between paragraphs)' },
      { k: 'vm_title', label: 'Vision & Mission heading' }, { k: 'vision', type: 'rich', rows: 3, label: 'Vision' }, { k: 'mission', type: 'rich', rows: 3, label: 'Mission' },
      { type: 'heading', label: 'Timeline' },
      { k: 'timeline_enabled', type: 'toggle', label: 'Show the timeline' },
      { k: 'timeline_title', label: 'Timeline heading', show: (v) => v.timeline_enabled },
      { k: 'timeline', type: 'list', label: 'Milestones', show: (v) => v.timeline_enabled, addLabel: 'Add milestone', item: [{ k: 'when', label: 'When', half: true }, { k: 'title', label: 'Title', half: true }, { k: 'text', type: 'rich', rows: 2, label: 'Text' }], newItem: () => ({ when: '', title: 'New milestone', text: '' }) },
      { type: 'heading', label: 'Values' },
      { k: 'values_title', label: 'Values heading' },
      { k: 'values', type: 'list', label: 'Values', addLabel: 'Add value', item: [{ k: 'icon', label: 'Emoji', half: true }, { k: 'title', label: 'Title', half: true }, { k: 'text', type: 'rich', rows: 2, label: 'Text' }], newItem: () => ({ icon: '🌱', title: 'New value', text: '' }) },
      { type: 'heading', label: '“As featured in” strip' },
      { k: 'featured_enabled', type: 'toggle', label: 'Show the strip', help: 'Only list publications that have actually featured Organik Greens.' },
      { k: 'featured_label', label: 'Strip label', show: (v) => v.featured_enabled },
      { k: 'featured_logos', type: 'list', label: 'Publications / partners', show: (v) => v.featured_enabled, noToggle: true, addLabel: 'Add', item: [{ k: 'name', label: 'Name', half: true }, { k: 'href', type: 'link', label: 'Link (optional)', half: true }, { k: 'image_url', type: 'image', label: 'Logo image (optional)' }], itemTitle: (x) => x.name, newItem: () => ({ name: 'Name', href: '', image_url: '' }) },
      { type: 'heading', label: 'Message form' },
      { k: 'ask_enabled', type: 'toggle', label: 'Show the message form' },
      { k: 'ask_eyebrow', label: 'Small label', show: (v) => v.ask_enabled }, { k: 'ask_heading', label: 'Heading', show: (v) => v.ask_enabled }, { k: 'ask_intro', type: 'rich', rows: 2, label: 'Text', show: (v) => v.ask_enabled },
      { type: 'heading', label: 'Search engines' }, { k: 'seo_title', label: 'Page title in Google' }, { k: 'seo_description', type: 'textarea', label: 'Description in Google' },
    ],
  },

  contact: {
    title: 'Contact page', preview: '/contact',
    fields: [
      { k: 'eyebrow', label: 'Small label' }, { k: 'title', type: 'rich', rows: 2, label: 'Headline' }, { k: 'lead', type: 'rich', rows: 3, label: 'Intro text' },
      { k: 'methods', type: 'list', label: 'Ways to reach you', addLabel: 'Add', item: [
        { k: 'icon', label: 'Emoji', half: true }, { k: 'label', label: 'Label', half: true }, { k: 'value', label: 'Value (email, number, place)' }, { k: 'sub', label: 'Small text' },
        { k: 'button_label', label: 'Button text (optional)', half: true }, { k: 'button_href', type: 'link', label: 'Button link', half: true },
      ], itemTitle: (x) => `${x.icon} ${x.label}`, newItem: () => ({ icon: '📌', label: 'Label', value: '', sub: '' }) },
      { k: 'follow_enabled', type: 'toggle', label: 'Show “Follow us” links' },
      { k: 'follow_title', label: 'Heading', show: (v) => v.follow_enabled },
      { k: 'follow_links', type: 'list', label: 'Follow links', show: (v) => v.follow_enabled, noToggle: true, addLabel: 'Add link', item: linkItem, newItem: () => ({ label: 'New', href: '' }) },
      { type: 'heading', label: 'Form' },
      { k: 'form_title', label: 'Form heading' }, { k: 'form_intro', type: 'rich', rows: 2, label: 'Form text' }, { k: 'form_placeholder', label: 'Example text in the message box' },
      { k: 'form_kinds', type: 'list', label: '“What is it about?” choices', noToggle: true, addLabel: 'Add choice', item: [{ k: 'label', label: 'Shown as', half: true }, { k: 'value', label: 'Saved as (one word)', half: true }], itemTitle: (x) => x.label, newItem: () => ({ label: 'New choice', value: 'other' }) },
      { type: 'heading', label: 'FAQ' },
      { k: 'faq_enabled', type: 'toggle', label: 'Show the FAQ' },
      { k: 'faq_eyebrow', label: 'Small label', show: (v) => v.faq_enabled }, { k: 'faq_title', label: 'Heading', show: (v) => v.faq_enabled },
      { k: 'faqs', type: 'list', label: 'Questions', show: (v) => v.faq_enabled, addLabel: 'Add question', item: [{ k: 'q', label: 'Question' }, { k: 'a', type: 'textarea', rows: 3, label: 'Answer' }], itemTitle: (x) => x.q, newItem: () => ({ q: 'New question?', a: '' }) },
      { type: 'heading', label: 'Search engines' }, { k: 'seo_title', label: 'Page title in Google' }, { k: 'seo_description', type: 'textarea', label: 'Description in Google' },
    ],
  },

  seo: {
    title: 'Google & sharing (SEO)', preview: '/',
    fields: [
      { k: 'title', label: 'Home page title in Google' },
      { k: 'description', type: 'textarea', label: 'Home page description in Google' },
      { k: 'og_image', type: 'image', label: 'Default image when the site is shared on WhatsApp / social media' },
      { k: 'google_verification', label: 'Google Search Console verification code (optional)' },
    ],
  },

  custom_pages: {
    title: 'Custom pages', preview: '/',
    intro: 'Create new pages (for example Privacy Policy, Partners, Media Kit) built from blocks. A page lives at organikgreens.com/<slug>. Add it to the menu or footer with its slug, e.g. /privacy-policy.',
    fields: [
      { k: 'pages', type: 'list', label: 'Pages', addLabel: 'Create a page', item: [
        { k: 'title', label: 'Page title', half: true },
        { k: 'slug', label: 'Address (slug), e.g. privacy-policy', half: true, help: 'Lowercase letters, numbers and dashes only. Cannot be blog, shop, about, contact, admin or preview.' },
        { k: 'show_header', type: 'toggle', label: 'Show the page header' },
        { k: 'eyebrow', label: 'Small label above the title' },
        { k: 'subtitle', type: 'rich', rows: 2, label: 'Text under the title' },
        { k: 'blocks', type: 'list', label: 'Content blocks, in order', addLabel: 'Add block', item: blockFields, itemTitle: (b) => `${(BLOCK_TYPES.find((t) => t[0] === b.type) || ['', b.type])[1].split(' (')[0]}: ${b.heading || b.slot || ''}`.trim(), newItem: newBlock },
        { k: 'seo_title', label: 'Title in Google' }, { k: 'seo_description', type: 'textarea', label: 'Description in Google' },
        { k: 'noindex', type: 'toggle', label: 'Hide this page from Google' },
      ], itemTitle: (p) => `${p.title}  —  /${p.slug}`, newItem: () => ({ title: 'New page', slug: `page-${Math.random().toString(36).slice(2, 6)}`, show_header: true, blocks: [newBlock()] }) },
    ],
  },
};

export const RESERVED_SLUGS = ['blog', 'shop', 'about', 'contact', 'admin', 'preview', 'api', 'sitemap.xml', 'robots.txt'];
