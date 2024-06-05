import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
} from "@trussworks/react-uswds";
import { useNavigate } from "react-router";
import IMAGES from "../images/images";

interface CardProps {
  title: string;
  imageSrc?: string;
  body: string;
  buttonText?: string;
  alt?: string;
  url: string;
  withBackground?: boolean;
}

const MediaCard = ({
  title,
  imageSrc,
  body,
  buttonText,
  alt = "Image",
  url,
  withBackground,
}: CardProps) => {
  const navigate = useNavigate();

  const navigateTo = (url: string) => {
    navigate(url);
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
  });
  }

  return (
    <Card
      className="list-none"
      containerProps={{ className: " drop-shadow-md w-80" }}
    >
      <CardHeader>
        <h3 className="usa-card__heading font-bold">{title}</h3>
      </CardHeader>
      {imageSrc && (
        <CardMedia>
          <div className=" bg-white">
            {withBackground ? (
              <img
                src={imageSrc}
                alt={alt}
                style={{
                  width: "100%",
                  backgroundImage: `url(${IMAGES.bannerLandingPage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  paddingTop: "15px",
                  objectFit: "fill",
                  paddingBottom: "15px",
                }}
              />
            ) : (
              <img
                src={imageSrc}
                alt={alt}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "fill",
                  paddingTop: "15px",
                }}
              />
            )}
          </div>
        </CardMedia>
      )}

      <CardBody className="padding-top-3">
        <p className="text-sm min-h-[60px]">{body}</p>
      </CardBody>
      <CardFooter>
        {buttonText &&
          <Button
            type="button"
            className={imageSrc ? "" : "mt-32"}
            onClick={() => navigateTo(url)}
          >
            {buttonText}
          </Button>
        }
      </CardFooter>
    </Card>
  );
};

export default MediaCard;
