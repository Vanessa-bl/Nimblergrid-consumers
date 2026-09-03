import "@testing-library/jest-dom";
import type { ComponentType, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import type { Content } from "@prismicio/client";

type RichTextBlock = {
  type: string;
  text: string;
  spans?: readonly { type: string; start: number; end: number }[];
};

type RichTextComponent = ComponentType<{ children: ReactNode }>;

const renderBlockContent = (
  block: RichTextBlock,
  components?: Record<string, RichTextComponent>,
): ReactNode => {
  const spans = [...(block.spans ?? [])].sort((a, b) => a.start - b.start);
  if (spans.length === 0) return block.text;

  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start > cursor) parts.push(block.text.slice(cursor, span.start));
    const SpanComponent = components?.[span.type];
    const spanText = block.text.slice(span.start, span.end);
    parts.push(
      SpanComponent
        ? <SpanComponent key={`${span.type}-${span.start}`}>{spanText}</SpanComponent>
        : spanText,
    );
    cursor = span.end;
  }

  if (cursor < block.text.length) parts.push(block.text.slice(cursor));
  return <>{parts}</>;
};

jest.mock("@prismicio/react", () => ({
  PrismicRichText: ({
    field,
    components,
  }: {
    field: RichTextBlock[] | null | undefined;
    components?: Record<string, RichTextComponent>;
  }) => {
    if (!Array.isArray(field)) return null;
    return (
      <>
        {field.map((block, index) => {
          const BlockComponent = components?.[block.type];
          const content = renderBlockContent(block, components);
          return BlockComponent
            ? <BlockComponent key={index}>{content}</BlockComponent>
            : <p key={index}>{content}</p>;
        })}
      </>
    );
  },
}));

import { Hero } from "@/components/home/hero";

const buildSlice = (
  overrides: Partial<Content.HeroSliceDefaultPrimary> = {},
): Content.HeroSlice => ({
  slice_type: "hero",
  slice_label: null,
  variation: "default",
  version: "initial",
  id: "hero$test",
  primary: {
    pretitle: "The best real estate platform",
    title: [
      {
        type: "heading1",
        text: "Rent, buy or sell your Property in the EU",
        spans: [{ type: "em", start: 21, end: 29 }],
        direction: "ltr",
      },
    ],
    description: [
      {
        type: "paragraph",
        text: "Discover thousands of verified properties in one place.",
        spans: [],
        direction: "ltr",
      },
    ],
    image: {
      url: "https://images.prismic.io/rs-content/test.jpg",
      alt: "Modern two-story house",
      dimensions: { width: 1080, height: 920 },
      copyright: null,
      edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
      id: "img-1",
    },
    image_caption: "photo · featured project",
    stats: [
      {
        type: "paragraph",
        text: "9,600+ verified studios and 202,000+ photos",
        spans: [
          { type: "strong", start: 0, end: 6 },
          { type: "strong", start: 28, end: 36 },
        ],
        direction: "ltr",
      },
    ],
    metrics: [
      { value: "9.6k+", label: "Professionals" },
      { value: "50k+", label: "Projects" },
    ],
    ...overrides,
  },
  items: [],
});

describe("Hero", () => {
  it("renders the pretitle when present", () => {
    render(<Hero slice={buildSlice()} />);
    expect(screen.getByText("The best real estate platform")).toBeInTheDocument();
  });

  it("renders the title as an h1", () => {
    render(<Hero slice={buildSlice()} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Rent, buy or sell your Property in the EU",
    );
  });

  it("renders the description paragraph", () => {
    render(<Hero slice={buildSlice()} />);
    expect(
      screen.getByText("Discover thousands of verified properties in one place."),
    ).toBeInTheDocument();
  });

  it("renders the image with url and alt from the Prismic field", () => {
    render(<Hero slice={buildSlice()} />);
    const img = screen.getByAltText("Modern two-story house");
    expect(img).toHaveAttribute("src", "https://images.prismic.io/rs-content/test.jpg");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("renders the image caption when present", () => {
    render(<Hero slice={buildSlice()} />);
    expect(screen.getByText("photo · featured project")).toBeInTheDocument();
  });

  it("renders the stats line with its highlighted values", () => {
    render(<Hero slice={buildSlice()} />);
    const highlight = screen.getByText("9,600+");
    expect(highlight.closest("p")).toHaveTextContent(
      "9,600+ verified studios and 202,000+ photos",
    );
  });

  it("renders each metric with its value and label", () => {
    render(<Hero slice={buildSlice()} />);
    expect(screen.getByText("9.6k+")).toBeInTheDocument();
    expect(screen.getByText("Professionals")).toBeInTheDocument();
    expect(screen.getByText("50k+")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("omits the pretitle when null", () => {
    render(<Hero slice={buildSlice({ pretitle: null })} />);
    expect(
      screen.queryByText("The best real estate platform"),
    ).not.toBeInTheDocument();
  });

  it("omits the image caption when null", () => {
    render(<Hero slice={buildSlice({ image_caption: null })} />);
    expect(screen.queryByText("photo · featured project")).not.toBeInTheDocument();
  });

  it("omits the metrics badge when the group is empty", () => {
    render(<Hero slice={buildSlice({ metrics: [] })} />);
    expect(screen.queryByText("Professionals")).not.toBeInTheDocument();
    expect(screen.queryByText("Projects")).not.toBeInTheDocument();
  });
});
