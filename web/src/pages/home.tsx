import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  const goToPortfolio = () => navigate("/portfolio");
  const goToRecommend = () => navigate("/stress");
  const goToLearning = () => navigate("/learning");

  const keyframes = {
    gradientBg: `
      @keyframes gradientBg {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    drawText: `
      @keyframes drawText {
        0% { stroke-dashoffset: 1000; }
        100% { stroke-dashoffset: 0; }
      }
    `,
    fillText: `
      @keyframes fillText {
        from { fill: rgba(255, 255, 255, 0); }
        to { fill: rgba(255, 255, 255, 1); }
      }
    `,
    fadeIn: `
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `
  };

  const styles = {
    pageContainer: {
      height: "100vh",
      overflow: "hidden",
      position: "relative"
    },
    homeBackground: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(-45deg, #5EACB3, #0B6180, #5EACB3, #0B6180)",
      backgroundSize: "400% 400%",
      animation: "gradientBg 20s ease infinite",
      margin: 0,
      padding: 0,
      position: "absolute",
      top: 0,
      transition: "transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
    },
    homeBackgroundBounceUp: {
      transform: "translateY(-100vh)",
      pointerEvents: "none"
    },
    frostedWrapper: {
      position: "relative",
      width: "80%",
      maxWidth: "800px",
      aspectRatio: "2/1",
      padding: "2px",
      background: "linear-gradient(90deg, #5EACB3 0%, #0B6180 100%)",
      borderRadius: "16px"
    },
    frostedContainer: {
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: "14px",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
      overflow: "hidden",
      opacity: 0,
      animation: "fadeIn 2s ease-in forwards",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem"
    },
    logoContainer: {
      width: "100%",
      height: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "2rem"
    },
    svgText: {
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      fill: "transparent",
      stroke: "white",
      strokeWidth: 1.5,
      animation: "drawText 4s cubic-bezier(0.77, 0, 0.175, 1) forwards, fillText 2s cubic-bezier(0.77, 0, 0.175, 1) forwards 2.2s"
    },
    button: {
      padding: "12px 32px",
      fontSize: "1.2rem",
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "white",
      borderRadius: "30px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backdropFilter: "blur(5px)",
      margin: "0.5rem",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-2px)"
      }
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "1rem"
    },
    loginSection: {
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(90deg, #5EACB3 0%, #0B6180 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      position: "absolute",
      top: "100vh",
      left: 0,
      transition: "transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
    },
    otherContainer: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(16px)",
      padding: "2rem",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  };

  const [isLoginClicked, setIsLoginClicked] = useState(false);

  return (
    <>
      <style>
        {keyframes.gradientBg}
        {keyframes.drawText}
        {keyframes.fillText}
        {keyframes.fadeIn}
      </style>
      <div style={styles.pageContainer}>
        <div
          style={{
            ...styles.homeBackground,
            ...(isLoginClicked ? styles.homeBackgroundBounceUp : {})
          }}
        >
          <div style={styles.frostedWrapper}>
            <div style={styles.frostedContainer}>
              <div style={styles.logoContainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 600 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    style={styles.svgText}
                    x="300"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="80"
                  >
                    BirdStocK
                  </text>
                </svg>
              </div>
              <button style={styles.button} onClick={() => setIsLoginClicked(true)}>
                Login
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.loginSection,
            transform: isLoginClicked ? "translateY(-100vh)" : "none"
          }}
        >
          <div style={styles.otherContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <text
                style={styles.svgText}
                x="300"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="60"
              >
                Welcome Back, Anvii
              </text>
            </svg>
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={goToPortfolio}>
                Portfolio
              </button>
              <button style={styles.button} onClick={goToRecommend}>
                Stress Tests
              </button>
              <button style={styles.button} onClick={goToLearning}>
                Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;