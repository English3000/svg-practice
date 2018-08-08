import React from "react"
import { Platform } from "react-native"
import ErrorBoundary from "./components/ErrorBoundary.js"
import Instructions from "./components/Instructions.js"
import PlayWeb from "./pages/Play.js"
import PlayMobile from "./screens/Play.js"

export default () => (
  <ErrorBoundary>
    <Instructions/>
    {Platform.OS === "web" ?
      <PlayWeb/> :
      <PlayMobile/>}
  </ErrorBoundary>
)
