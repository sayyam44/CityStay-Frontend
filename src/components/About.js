// import React from "react";
// import { Box, Typography, Avatar, Link, Divider, useTheme } from "@mui/material";
// import { GitHub, LinkedIn, Email } from "@mui/icons-material";
// import citystaynl from './Assets/citystaynl.jpg';
// import profile from './Assets/profile.jpg';


// function About() {
//   const theme = useTheme();

//   return (
//     <Box sx={{ 
//       maxWidth: 800, 
//       margin: "0 auto", 
//       padding: 4,
//       display: "flex",
//       flexDirection: "column",
//       gap: 3
//     }}>
//       {/* Top Section - About CityStayNL */}
//       <Box sx={{ 
//         display: "flex", 
//         flexDirection: { xs: "column", md: "row" },
//         gap: 4,
//         alignItems: "center"
//       }}>
//         <Box
//           component="img"
//           src={citystaynl}
//           sx={{ 
//             width: 200,
//             height: 200,
//             borderRadius: 2,
//             boxShadow: theme.shadows[4],
//             objectFit: 'cover'
//           }}
//         />
//         <Box>
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
//             About CityStayNL
//           </Typography>
//           <Typography variant="body1" paragraph>
//           The idea behind CityStayNL is to simplify the process of renting or
//           buying reliable properties in St. John's, Newfoundland, for 
//           both newcomers and residents. With the growing demand for 
//           housing due to a surge in immigrants and students, CityStayNL 
//           bridges the gap by providing a full-stack, location-based real estate 
//           web application. Designed for ease of use, it connects people 
//           with affordable and convenient housing options, helping them
//           find the right place to call home in St.John's.
//           </Typography>
//         </Box>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       {/* Bottom Section - About Developer */}
//       <Box sx={{ 
//         display: "flex", 
//         flexDirection: { xs: "column", md: "row" },
//         gap: 4,
//         alignItems: "center"
//       }}>
//         <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
//             Meet the Developer
//           </Typography>
//           <Typography variant="body1" paragraph>
//           Hello! I'm Sayyam Kundra, an experienced software 
//           engineer and full-stack developer with a passion 
//           for creating meaningful web applications and software 
//           solutions. I hold a Master's degree in Computer 
//           Engineering from Memorial University of Newfoundland 
//           in St. John's. I’ve always been driven to solve
//            real-world problems using technology.One of my 
//            recent projects, CityStayNL, aims to address the 
//            challenges of renting or buying reliable properties 
//            in St. John’s, Newfoundland, providing a 
//            user-friendly platform for both newcomers and 
//            residents of the city.
//           </Typography>
//           <Box sx={{ 
//             display: "flex", 
//             gap: 3, 
//             mt: 3,
//             justifyContent: { xs: "center", md: "flex-start" },
//             flexWrap: 'wrap'
//           }}>
//             <Link 
//               href="https://github.com/sayyam44" 
//               target="_blank"
//               rel="noopener"
//               sx={{ 
//                 display: "flex", 
//                 alignItems: "center",
//                 textDecoration: 'underline'
//               }}
//             >
//               <GitHub sx={{ mr: 1 }} /> GitHub
//             </Link>
//             <Link 
//               href="https://www.linkedin.com/in/sayyamkundra44/" 
//               target="_blank"
//               rel="noopener"
//               sx={{ 
//                 display: "flex", 
//                 alignItems: "center",
//                 textDecoration: 'underline'
//               }}
//             >
//               <LinkedIn sx={{ mr: 1 }} /> LinkedIn
//             </Link>
//             <Link 
//               href="mailto:skundra@mun.ca"
//               sx={{ 
//                 display: "flex", 
//                 alignItems: "center",
//                 textDecoration: 'underline'
//               }}
//             >
//               <Email sx={{ mr: 1 }} /> Email
//             </Link>
//           </Box>
//         </Box>
//         <Avatar
//           src={profile}
//           sx={{ 
//             width: 200, 
//             height: 200,
//             boxShadow: theme.shadows[4]
//           }}
//         />
//       </Box>
//     </Box>
//   );
// }

// export default About;


          // The idea behind CityStayNL is to simplify the process of renting or
          // buying reliable properties in St. John's, Newfoundland, for 
          // both newcomers and residents. With the growing demand for 
          // housing due to a surge in immigrants and students, CityStayNL 
          // bridges the gap by providing a full-stack, location-based real estate 
          // web application. Designed for ease of use, it connects people 
          // with affordable and convenient housing options, helping them
          // find the right place to call home in St.John's.


          // Hello! I'm Sayyam Kundra, an experienced software 
          // engineer and full-stack developer with a passion 
          // for creating meaningful web applications and software 
          // solutions. I hold a Master's degree in Computer 
          // Engineering from Memorial University of Newfoundland 
          // in St. John's. I’ve always been driven to solve
          //  real-world problems using technology.One of my 
          //  recent projects, CityStayNL, aims to address the 
          //  challenges of renting or buying reliable properties 
          //  in St. John’s, Newfoundland, providing a 
          //  user-friendly platform for both newcomers and 
          //  residents of the city.

import React from "react";
import { Box, Typography, Avatar, Link, Divider, useTheme } from "@mui/material";
import { GitHub, LinkedIn, Email } from "@mui/icons-material";
import citystaynl from './Assets/citystaynl.jpg';
import profile from './Assets/profile.jpg';
import dev2 from './Assets/dev2.jpg'; // ✅ Add the second developer's image

function About() {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Top Section - About CityStayNL */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "center" }}>
        <Box component="img" src={citystaynl} sx={{ width: 200, height: 200, borderRadius: 2, boxShadow: theme.shadows[4], objectFit: 'cover' }} />
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>About CityStayNL</Typography>
          <Typography variant="body1" paragraph>
          CityStayNL simplifies the process of renting or buying reliable properties in St. John's, Newfoundland for newcomers and residents.
          With rising demand due to immigration and student influx, it bridges the gap through a full-stack, location-based real estate platform.
          The app offers affordable and convenient housing options, helping users find the right place to call home.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Bottom Section - About Developers */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>Meet the Developers</Typography>

      {/* Developer 1 */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "center" }}>
        <Box sx={{ textAlign: { xs: "center", md: "left" }, flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Sayyam Kundra</Typography>
          <Typography variant="body2" paragraph>
          I'm Sayyam Kundra, a full-stack developer and software engineer with a Master's in Computer Engineering from Memorial University.
          I build meaningful tech solutions like CityStayNL, a platform that simplifies renting or buying homes in St. John’s, Newfoundland.          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: 2, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: 'wrap' }}>
            <Link href="https://github.com/sayyam44" target="_blank" rel="noopener" sx={{ display: "flex", alignItems: "center", textDecoration: 'underline' }}><GitHub sx={{ mr: 1 }} /> GitHub</Link>
            <Link href="https://www.linkedin.com/in/sayyamkundra44/" target="_blank" rel="noopener" sx={{ display: "flex", alignItems: "center", textDecoration: 'underline' }}><LinkedIn sx={{ mr: 1 }} /> LinkedIn</Link>
            <Link href="mailto:skundra@mun.ca" sx={{ display: "flex", alignItems: "center", textDecoration: 'underline' }}><Email sx={{ mr: 1 }} /> Email</Link>
          </Box>
        </Box>
        <Avatar src={profile} sx={{ width: 150, height: 150, boxShadow: theme.shadows[4] }} />
      </Box>

      {/* Developer 2 */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, gap: 4, alignItems: "center", mt: 4 }}>
        <Box sx={{ textAlign: { xs: "center", md: "left" }, flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Gurpreet Singh</Typography>
          <Typography variant="body2" paragraph>
          Passionate software developer with a Master's in Computer Engineering from Memorial University.
          Enthusiastic about solving real-world problems and exploring AI-driven, intelligent tech solutions.          </Typography>
        </Box>
        <Avatar src={dev2} sx={{ width: 150, height: 150, boxShadow: theme.shadows[4] }} />
      </Box>
    </Box>
  );
}

export default About;
