import { useEffect, useState } from 'react';
import styles from './styles.module.css';

type Props = {
  slides: {
    image: string;
    content: string;
  }[];
};

export const VerticalSlider = ({ slides }: Props) => {
  const [currentItem, setCurrentItem] = useState(1);
  const [transitionMade, setTransition] = useState(0);

  const nextImage = async () => {
    setTransition(1);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentItem(currentItem < slides.length - 2 ? currentItem + 1 : 1);
    setTransition(0);
  };

  const prevImage = async () => {
    setTransition(2);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentItem(currentItem > 1 ? currentItem - 1 : 1);
    setTransition(0);
  };

  useEffect(() => {
    console.log('transition made', transitionMade);
  }, [transitionMade]);

  const prevSlide = currentItem - 1 in slides ? slides[currentItem - 1] : null;
  const currentSlide = currentItem in slides ? slides[currentItem] : null;
  const nextSlide = currentItem + 1 in slides ? slides[currentItem + 1] : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: '100px',
        }}
      >
        {!prevSlide ? (
          <div
            style={{
              height: '100px',
              width: '682px',
              paddingBottom: '40px',
            }}
          ></div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              style={{ position: 'absolute', paddingBottom: '20px' }}
              src="/images/upNft.png"
            />
            <img
              className={styles.clippedImage}
              onClick={prevImage}
              src={prevSlide.content}
              style={{
                zIndex: transitionMade === 2 ? 3 : 1,
                objectFit: 'cover',
                height: transitionMade === 2 ? 'auto' : '100px',
                width: '682px',
                paddingBottom: '40px',
                opacity: transitionMade === 2 ? 1 : 0.5,
                transitionDuration: '0.5s',
                transform:
                  transitionMade !== 0
                    ? transitionMade === 2
                      ? 'translateY(120px)'
                      : 'none'
                    : 'none',
              }}
            />
          </div>
        )}
      </div>
      <div>
        {currentSlide && (
          <img
            width="726px"
            src={currentSlide.content}
            style={{
              position: 'relative',
              // transitionDuration: "0.15s",
              // transform: transitionMade != 0 ? transitionMade == 1 ? "scale(0.8)translateY(-500px)scale(1)translateY(1500px)" : "scale(0.8)translateY(500px)scale(1)translateY(-1500px)" : "none",
              transform: transitionMade !== 0 ? 'scale(0)' : 'none',
              // display: transitionMade != 0 ? 'none' : 'block',
              zIndex: 2,
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          />
        )}
      </div>
      <div
        style={{
          height: '100px',
        }}
      >
        {!nextSlide ? (
          <div
            style={{
              height: '100px',
              width: '682px',
              paddingTop: '40px',
            }}
          ></div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // transitionDuration: "0.5s",
              // transform:
              //   transitionMade !== 0
              //     ? transitionMade == 1
              //       ? "translateY(-20px)scale(1.05)"
              //       : "none"
              //     : "none"
            }}
          >
            <img
              style={{ position: 'absolute', paddingTop: '30px' }}
              src="/images/downNft.png"
            />
            <img
              className={styles.clippedImage}
              onClick={nextImage}
              src={nextSlide.content}
              style={{
                zIndex: transitionMade === 1 ? 3 : 1,
                objectFit: 'cover',
                height: transitionMade === 1 ? 'auto' : '100px',
                width: '682px',
                paddingTop: '40px',
                opacity: transitionMade === 1 ? 1 : 0.5,
                transitionDuration: '0.5s',
                transform:
                  transitionMade !== 0
                    ? transitionMade === 1
                      ? 'translateY(-800px)'
                      : 'none'
                    : 'none',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
