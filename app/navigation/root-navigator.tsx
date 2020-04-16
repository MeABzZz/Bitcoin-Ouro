import * as React from "react"
import { RootStackScreen } from "./primary-navigator"
import { createStackNavigator } from "@react-navigation/stack"
import { GetStartedScreen } from "../screens/get-started-screen"
import { DebugScreen } from "../screens/debug-screen"
import { WelcomeFirstScreen } from "../screens/welcome-screens"

import { inject, observer } from "mobx-react"

import auth from "@react-native-firebase/auth"
import { getEnv } from "mobx-state-tree"
import { useEffect, useState } from "react"
import { when } from "mobx"
import { Onboarding } from "types"
import { SplashScreen } from "../screens/splash-screen"

const INIT_DELAY_LND = 100

const Loading = createStackNavigator()

export const RootStack = inject("dataStore")(
  observer(({ dataStore }) => {
    const [initialRouteName, setInitialRouteName] = useState("")
    const [authReady, setAuthReady] = useState(false)

    useEffect(() => {
      const startLnd = async () => {
        getEnv(dataStore).lnd.start()
      }

      startLnd()

      setTimeout(async function () {
        await getEnv(dataStore).lnd.openWallet()
      }, INIT_DELAY_LND)
    }, [])

    const onAuthStateChanged = async (user) => {
      console.tron.log(`onAuthStateChanged`, user)
      console.log(`onAuthStateChanged`, user)

      if (user == null) {
        await auth().signInAnonymously()
      } else setAuthReady(true)
    }

    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
      return subscriber // unsubscribe on unmount
    }, [])

    useEffect(() => {
      const _ = async () => {
        await when(() => dataStore.lnd.lndReady === true)
        when(() => authReady)

        if (dataStore.onboarding.has(Onboarding.walletDownloaded)) {
          setInitialRouteName("primaryStack")
        } else {
          // new install
          setInitialRouteName("getStarted")
        }
      }

      _()
    }, [])

    if (initialRouteName === "") {
      return <SplashScreen lndVersion={dataStore.lnd.version} />
    }

    return (
      <Loading.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ gestureEnabled: false }}
      >
        <Loading.Screen
          name="getStarted"
          component={GetStartedScreen}
          options={{ headerShown: false }}
        />
        <Loading.Screen name="debug" component={DebugScreen} />
        <Loading.Screen
          name="welcomeFirst"
          component={WelcomeFirstScreen}
          options={{ headerShown: false }}
        />
        <Loading.Screen
          name="primaryStack"
          component={RootStackScreen}
          options={{ headerShown: false }}
        />
      </Loading.Navigator>
    )
  }),
)