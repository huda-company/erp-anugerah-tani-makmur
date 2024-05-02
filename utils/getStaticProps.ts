// utils/getStaticProps.ts

export async function getStaticProps(ctx: any) {
  return {
    props: {
      messages: (await import(`^/dictionaries/${ctx.locale}.json`)).default,
    },
  };
}
