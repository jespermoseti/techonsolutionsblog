import { useState, useEffect } from "react";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";
import classes from "./post.module.css";

export const Post = ({ title, body, image, author, time }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [authorImageUrl, setAuthorImageUrl] = useState("");

  useEffect(() => {
    const imgBuilder = imageUrlBuilder({
      projectId: "kyefhei3",
      dataset: "production",
    });
    setImageUrl(imgBuilder.image(image));
    setAuthorImageUrl(imgBuilder.image(author.image));
  }, [image, author.image]);

  return (
    <section>
      <Toolbar />
      <div className={classes.main}>
        <h1>{title}</h1>
        <div className={classes.postDetails}>
          <p>{new Date(time).toLocaleString()}</p>
          <h5>
            <p>By</p>
          </h5>
          <p>{author.name}</p>
          {authorImageUrl && <img src={authorImageUrl} />}
        </div>
        {imageUrl && <img className={classes.mainImage} src={imageUrl} />}
        <div className={classes.body}>
          <BlockContent
            blocks={body}
            imageOptions={{ w: 160, h: 120, fit: "max" }}
            projectId={"kyefhei3"}
            dataset="production"
          />
        </div>
        //<div className={classes.closingDiv}>
         // <h3>The End</h3>
          //<h4>
            //Visit{" "}
            //<Link href={"https://techonsolutions.com/"}>Techonsolutions</Link>{" "}
            //for IT Services and Solutions
          //</h4>
          //<p>Contact us at +254113270070</p>
        //</div>
      </div>
    </section>
  );
};

export const getStaticPaths = async () => {
  const query = `*[ _type == 'post'] {_id, slug{current}}`;

  const url = `https://${process.env.projectId}.api.sanity.io/v2021-10-21/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());

  const posts = result.result;
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (pageContext) => {
  // const pageSlug = pageContext.query.slug; accessing the page slug if we were using getServersideProps
  const pageSlug = pageContext.params.slug;

  if (!pageSlug) {
    return {
      notFound: true,
    };
  }

  const query = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}" ] {title,body,_createdAt,mainImage, author -> {name, image} }`
  );
  const url = `https://${process.env.projectId}.api.sanity.io/v2021-10-21/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());

  const post = result.result[0];

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        title: post.title,
        body: post.body,
        image: post.mainImage,
        time: post._createdAt,
        author: post.author,
      },
      revalidate: 60,
    };
  }
};
export default Post;
