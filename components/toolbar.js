import { useRouter } from "next/router";
import classes from "./toolbar.module.css";

export const Toolbar = () => {
  const router = useRouter();

  return (
    <div className={classes.main}>
      <div onClick={() => router.push("/")}>Home</div>
      <div
        onClick={() => (window.location.href = "https://techonsolutions.com/")}
      >
        Techonsolutions
      </div>
      <div
        onClick={() =>
          (window.location.href = "https://jesper.techonsolutions.com/")
        }
      >
        Author
      </div>
    </div>
  );
};
