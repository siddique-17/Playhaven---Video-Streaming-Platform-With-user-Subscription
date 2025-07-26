// import React from "react";
// import { motion } from "framer-motion";

// const AnimatedText2 = ({ text = "" }) => {
//   return (
//     <motion.span
//       style={{
//         display: "inline-block",
//         whiteSpace: "normal",
//         overflow: "visible",
//         wordBreak: "break-word",
//       }}
//       initial="hidden"
//       animate="visible"
//       variants={{
//         hidden: { opacity: 0 },
//         visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
//       }}
//     >
//       {text.split(/(, )/).map((segment, index) => (
//         <React.Fragment key={index}>
//           {segment.split("").map((char, charIndex) => (
//             <motion.span
//               key={`${index}-${charIndex}`}
//               style={{ display: "inline-block" }}
//               variants={
//                 char === "," || char === " "
//                   ? {} // No animation for spaces and commas
//                   : {
//                       hidden: { opacity: 0, x: -5 },
//                       visible: { opacity: 1, x: 0 },
//                     }
//               }
//               transition={{ ease: "easeInOut", duration: 0.3 }}
//             >
//               {char}
//             </motion.span>
//           ))}
//         </React.Fragment>
//       ))}
//     </motion.span>
//   );
// };

// export default AnimatedText2;

import React from "react";
import { motion } from "framer-motion";

const AnimatedText2 = ({ text = "" }) => {
  return (
    <motion.span
      style={{
        display: "inline-block",
        whiteSpace: "normal",
        overflow: "visible",
        wordBreak: "break-word",
      }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText2;
