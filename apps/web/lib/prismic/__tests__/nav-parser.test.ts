import type { RichTextField } from "@prismicio/client";
import { extractHrefFromRichText } from "@/lib/prismic/nav-parser";

const paragraph = (text: string, spans: unknown[] = []): RichTextField =>
  [{ type: "paragraph", text, spans }] as unknown as RichTextField;

const hyperlink = (url: string, target?: string) => ({
  start: 0,
  end: 5,
  type: "hyperlink" as const,
  data: { link_type: "Web", url, ...(target ? { target } : {}) },
});

describe("extractHrefFromRichText", () => {
  it("returns null for an empty field", () => {
    expect(extractHrefFromRichText([])).toBeNull();
  });

  it("returns null when the field is not an array", () => {
    expect(extractHrefFromRichText(null as unknown as RichTextField)).toBeNull();
  });

  it("extracts href and marks external when the hyperlink targets a new tab", () => {
    const field = paragraph("click", [hyperlink("/buy", "_blank")]);
    expect(extractHrefFromRichText(field)).toEqual({ href: "/buy", external: true });
  });

  it("marks a hyperlink without target as internal", () => {
    const field = paragraph("click", [hyperlink("/rent")]);
    expect(extractHrefFromRichText(field)).toEqual({ href: "/rent", external: false });
  });

  it("treats plain text starting with / as an internal href", () => {
    expect(extractHrefFromRichText(paragraph("/sell"))).toEqual({
      href: "/sell",
      external: false,
    });
  });

  it("treats plain text with https:// as an external href", () => {
    expect(extractHrefFromRichText(paragraph("https://ext.com"))).toEqual({
      href: "https://ext.com",
      external: true,
    });
  });

  it("treats plain text with http:// as an external href", () => {
    expect(extractHrefFromRichText(paragraph("http://ext.com"))).toEqual({
      href: "http://ext.com",
      external: true,
    });
  });

  it("returns null when text is not a URL and there are no spans", () => {
    expect(extractHrefFromRichText(paragraph("buy now"))).toBeNull();
  });

  it("prefers the first hyperlink over trailing plain text", () => {
    const field = paragraph("click", [hyperlink("/first")]);
    expect(extractHrefFromRichText(field)).toEqual({ href: "/first", external: false });
  });
});
