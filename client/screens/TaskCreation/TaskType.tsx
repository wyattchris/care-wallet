import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import BottomSheet, {
  BottomSheetBackdrop,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useNavigation } from '@react-navigation/native';
import { clsx } from 'clsx';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  GestureHandlerRootView,
  ScrollView
} from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';

import Financial from '../../assets/task-creation/financial.svg';
import Home from '../../assets/task-creation/home.svg';
import Other from '../../assets/task-creation/other.svg';
import Personal from '../../assets/task-creation/personal.svg';
import RedPill from '../../assets/task-creation/red-pill.svg';
import { BackButton } from '../../components/nav_buttons/BackButton';
import { CloseButton } from '../../components/nav_buttons/CloseButton';
import { AppStackNavigation } from '../../navigation/types';
import { Category, CategoryToTypeMap } from '../../types/type';

export default function TaskType() {
  const navigation = useNavigation<AppStackNavigation>();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | Category>(
    null
  );
  const filters = Object.values(Category).map((filter) => ({
    label: filter,
    value: filter
  }));

  const bottomSheetSnapPoints = useMemo(() => ['50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };
  const snapToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  function getCategoryIcon(category: Category): JSX.Element | null {
    switch (category) {
      case Category.HEALTH:
        return <RedPill />;
      case Category.PERSONAL:
        return <Personal />;
      case Category.HOME:
        return <Home />;
      case Category.FINANCIAL:
        return <Financial />;
      case Category.OTHER:
        return <Other />;
      default:
        return null;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-carewallet-white">
      <GestureHandlerRootView>
        <View className="flex w-full flex-row items-center border-b border-carewallet-gray bg-carewallet-white">
          <BackButton />
          <Text className="mx-auto my-7 pr-20 font-carewallet-manrope-bold text-lg text-carewallet-blue">
            Step 1 of 3
          </Text>
        </View>
        <View className="my-2" />
        <ScrollView className="h-[90%]">
          <View className="flex w-full flex-row items-start justify-between px-4">
            <Text className="mx-1 font-carewallet-manrope-bold text-[24px]">
              Choose Type of Task
            </Text>

            <Button
              className=" h-14 items-center justify-center rounded-lg bg-carewallet-blue text-carewallet-white"
              textColor="white"
              onPress={() => snapToIndex(0)}
            >
              FILTER
            </Button>
          </View>

          <View className="flex w-[90vw] justify-between p-3">
            {selectedCategory ? (
              <View>
                <Text
                  className={clsx(
                    'font-carewallet-montserrat-bold text-xs uppercase tracking-wide',
                    'p-3'
                  )}
                >
                  {selectedCategory}
                </Text>
                <View className="w-[100vw] flex-row flex-wrap">
                  {CategoryToTypeMap[selectedCategory].map((item2, index2) => (
                    <TouchableOpacity
                      key={index2}
                      onPress={() =>
                        navigation.navigate('TaskCreation', {
                          taskType: JSON.stringify(item2)
                        })
                      }
                    >
                      <View className="m-2 h-24 w-40 items-start rounded-lg border border-carewallet-gray p-2">
                        {getCategoryIcon(selectedCategory)}
                        <Text className="m-1 mt-3 font-carewallet-manrope-bold">
                          {item2}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              Object.values(Category).map((item, index) => (
                <View key={index}>
                  <Text
                    className={clsx(
                      'font-carewallet-montserrat-bold text-xs uppercase tracking-wide',
                      index > 0 ? 'p-3' : ''
                    )}
                  >
                    {item}
                  </Text>
                  <View className="w-[100vw] flex-row flex-wrap">
                    {CategoryToTypeMap[item].map((item2, index2) => (
                      <TouchableOpacity
                        key={index2}
                        onPress={() =>
                          navigation.navigate('TaskCreation', {
                            taskType: JSON.stringify(item2)
                          })
                        }
                      >
                        <View className="m-2 h-24 w-40 items-start rounded-lg border border-carewallet-gray p-2">
                          {getCategoryIcon(item)}
                          <Text className="m-1 mt-3 font-carewallet-manrope-bold">
                            {item2}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={bottomSheetSnapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
        >
          <View>
            <View className="flex flex-row justify-between">
              <Text className="m-5 text-2xl font-bold">Filter</Text>
              <CloseButton onPress={closeBottomSheet} />
            </View>

            <DropDownPicker
              open={open}
              value={selectedCategory}
              items={filters}
              setOpen={setOpen}
              setValue={setSelectedCategory}
              placeholder="Category"
              onSelectItem={() => {
                closeBottomSheet();
              }}
              style={{
                width: '95%',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 0,
                borderColor: 'transparent',
                borderBottomColor: 'black'
              }}
            />
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
