import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuth } from '@dalab/shared';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://faea80204e48aca693507f078e080d48@o4512046667661312.ingest.de.sentry.io/4512046678999120",
});

function App(): React.JSX.Element {
    const { initialize } = useAuth();

    useEffect(() => {
        // Initializing auth for mobile
        initialize();
    }, [initialize]);

    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

export default Sentry.wrap(App);
