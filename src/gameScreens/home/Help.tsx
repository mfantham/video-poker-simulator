import styled from "styled-components";

const HelpHolder = styled.div`
  a {
    color: #fff;
  }
`;

export const Help = () => {
  // Shows a page to help people get help with a gambling problem
  return (
    <HelpHolder>
      <h1>Help</h1>
      <p>
        If you or someone you know has a gambling problem, help is available.
      </p>
      <p>
        Try{" "}
        <a
          href="https://www.ncpgambling.org/help-treatment/faq/"
          target="_blank"
        >
          https://www.ncpgambling.org/
        </a>{" "}
        or{" "}
        <a href="https://www.gamcare.org.uk/" target="_blank">
          https://www.gamcare.org.uk/
        </a>{" "}
        to get started.
      </p>
    </HelpHolder>
  );
};
