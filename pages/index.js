import { useEffect, useState } from "react";
import { Toolbar } from "../components/toolbar";
import imageUrlBuilder from "@sanity/image-url";
import { useRouter } from "next/router";
import classes from "./home.module.css";

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: "kyefhei3",
        dataset: "production",
      });

      setMappedPosts(
        posts.map((p) => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
            authorImage: imgBuilder.image(p.author.image).width(50).height(50),
          };
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);

  return (
    <section>
      <Toolbar />
      <div className={classes.main}>
        <h1>Welcome to my blog</h1>
        <h3>Recent posts</h3>
        <div className={classes.feed}>
          {mappedPosts.length ? (
            mappedPosts.map((p, index) => (
              <div
                onClick={() => router.push(`/post/${p.slug.current}`)}
                key={index}
                className={classes.post}
              >
                <h3>{p.title}</h3>
                <img className={classes.mainImage} src={p.mainImage} />
                <div className={classes.author}>
                  <h6>By {p.author.name}</h6>
                  <img src={p.authorImage} />
                </div>
              </div>
            ))
          ) : (
            <>No Posts Yet</>
          )}
        </div>
      </div>
    </section>
  );
}

export const getServerSideProps = async (pageContext) => {
  const query = encodeURIComponent(
    '*[ _type == "post" ] | order(_id) [0...100]{slug,title,body,_id,_createdAt,mainImage, author -> {name, image}, categories[0] -> {title} }'
  );
  const url = `https://${process.env.projectId}.api.sanity.io/v2021-10-21/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      },
    };
  } else {
    return {
      props: {
        posts: result.result,
      },
    };
  }
};
