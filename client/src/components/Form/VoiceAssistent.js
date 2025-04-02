import React, { useEffect } from 'react';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/Auth';

const VoiceAssistant = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [auth] = useAuth();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.start();

        recognition.onresult = async (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          console.log("Voice command received:", transcript);
          if (transcript.includes("go to cart") || transcript.includes("open cart")) {
            console.log("Navigating to Cart...");
            navigate("/cart");
          } 
          else if (transcript.includes("go to home") || transcript.includes("open home")) {
            console.log("Navigating to Home...");
            navigate("/");
          } 
          else if (transcript.includes("go to categories") || transcript.includes("open categories")) {
            console.log("Navigating to Categories...");
            navigate("/categories");
          }
          if (transcript.includes("search for")) {
              const keyword = transcript.replace("search for", "").trim();
              console.log("Extracted keyword:", keyword);
      
              if (!keyword) {
                  console.warn("No keyword detected after 'search for'.");
                  return;
              }
      
              setValues({ keyword, results: [] });
              console.log("Updated search context with keyword:", keyword);
      
              try {
                  const { data } = await axios.get(
                      `${process.env.REACT_APP_API}/api/v1/product/search-product/${keyword}`,
                      { headers: { Authorization: auth?.token } }
                  );
                  console.log("API Response:", data);
      
                  setValues({ keyword, results: data });
      
                  if (data.length > 0) {
                      console.log("Navigating to search page...");
                      navigate("/search");
                  } else {
                      console.warn("No results found for:", keyword);
                      alert("No products found.");
                  }
              } catch (error) {
                  console.error("Error fetching search results:", error);
              }
          }
      };
      

        recognition.onerror = (event) => {
            console.error("Voice assistant error:", event.error);
        };

        return () => recognition.stop();
    }, [setValues, navigate]);

    return <></>;
};

export default VoiceAssistant;
