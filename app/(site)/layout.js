import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PromoSlot from "@/components/PromoSlot";
import { getSettings, isHrefDisabled } from "@/lib/site";
import { on } from "@/lib/rich";

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  const items = on(s.nav.items).filter((i) => !isHrefDisabled(i.href, s)).map(({ id, label, href, new_tab }) => ({ id, label, href, new_tab }));
  const cta = s.nav.cta?.enabled && !isHrefDisabled(s.nav.cta.href, s) ? s.nav.cta : null;
  return (
    <>
      <Nav items={items} cta={cta} brand={s.brand} />
      <PromoSlot slot="sitewide_top" />
      {children}
      <PromoSlot slot="above_footer" />
      <Footer s={s} />
      <PromoSlot slot="popup" />
    </>
  );
}
