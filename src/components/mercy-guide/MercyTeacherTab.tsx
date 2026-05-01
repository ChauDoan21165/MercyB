// Path: src/components/mercy-guide/MercyTeacherTab.tsx
// File: MercyTeacherTab.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookmarkPlus,
  Brain,
  Crown,
  Lightbulb,
  Lock,
  MessageCircleHeart,
  Mic,
  PenSquare,
  Sparkles,
  Target,
} from 'lucide-react';
import { KID_PAGE_14_ITEMS } from './kids/kidPage14Data';
import { KID_PAGE_15_ITEMS } from './kids/kidPage15Data';
import { KID_PAGE_16_ITEMS } from './kids/kidPage16Data';
import { KID_PAGE_17_ITEMS } from './kids/kidPage17Data';
import { KID_PAGE_18_ITEMS } from './kids/kidPage18Data';
import { KID_PAGE_19_ITEMS } from './kids/kidPage19Data';
import { KID_PAGE_20_ITEMS } from './kids/kidPage20Data';
import { KID_PAGE_21_ITEMS } from './kids/kidPage21Data';
import { KID_PAGE_22_ITEMS } from './kids/kidPage22Data';
import { KID_PAGE_23_ITEMS } from './kids/kidPage23Data';
import { KID_PAGE_24_ITEMS } from './kids/kidPage24Data';
import { KID_PAGE_25_ITEMS } from './kids/kidPage25Data';
import { KID_PAGE_26_ITEMS } from './kids/kidPage26Data';
import { KID_PAGE_27_ITEMS } from './kids/kidPage27Data';
import { KID_PAGE_28_ITEMS } from './kids/kidPage28Data';
import { KID_PAGE_29_ITEMS } from './kids/kidPage29Data';
import { KID_PAGE_30_ITEMS } from './kids/kidPage30Data';
import { KID_PAGE_31_ITEMS } from './kids/kidPage31Data';
import { KID_PAGE_32_ITEMS } from './kids/kidPage32Data';
import { KID_PAGE_33_ITEMS } from './kids/kidPage33Data';
import { KID_PAGE_34_ITEMS } from './kids/kidPage34Data';
import type {
  GrammarApiResponse,
  GrammarWritingTeacherState,
  TeacherMemorySummaryItem,
} from './types';
import { NotebookPanel } from '@/components/notebook/NotebookPanel';
import { SaveWordPopup } from '@/components/notebook/SaveWordPopup';
import type { NotebookItemType } from '@/services/notebookService';

type LearningSupportMode = 'gentle' | 'guided' | 'immersion';

type KidsPageId =
  | 'page1'
  | 'page2'
  | 'page3'
  | 'page4'
  | 'page5'
  | 'page6'
  | 'page7'
  | 'page8'
  | 'page9'
  | 'page10'
  | 'page11'
  | 'page12'
  | 'page13'
  | 'page14'
  | 'page15'
  | 'page16'
  | 'page17'
  | 'page18'
  | 'page19'
  | 'page20'
  | 'page21'
  | 'page22'
  | 'page23'
  | 'page24'
  | 'page25'
  | 'page26'
  | 'page27'
  | 'page28'
  | 'page29'
  | 'page30'
  | 'page31'
  | 'page32'
  | 'page33'
  | 'page34';

interface Props {
  latestTeacherWritingState?: GrammarWritingTeacherState | null;
  latestAnalysisResult?: GrammarApiResponse | null;
  teacherMemorySummary?: TeacherMemorySummaryItem[];
  onOpenPronunciation?: () => void;
  onOpenWriting?: () => void;
  isLocked?: boolean;
  onUnlock?: () => void;
  unlockTitle?: string;
  unlockDescription?: string;
  unlockButtonLabel?: string;
  learningSupportMode?: LearningSupportMode | string;
  isKidsMode?: boolean;
  kidsModeAgeBand?: string | null;
  teacherLabel?: string | null;
  disableTeacherWriting?: boolean;
  selectedKidsObjectKey?: string | null;
  onSelectKidsObject?: (key: string) => void;
  selectedKidsPage?: KidsPageId;
  onSelectKidsPage?: (page: KidsPageId) => void;
}

type BilingualText = {
  vi?: string;
  en?: string;
};

type TeacherDisplayResult = {
  correctedText?: unknown;
  enhancedText?: unknown;
  explanation?: unknown;
  grammarPoints: unknown[];
  tense?: unknown;
};

type JourneyStepStatus = {
  key: 'express' | 'improve' | 'speak' | 'understand';
  title: string;
  caption: string;
  done: boolean;
};

type ProgressNote = {
  title: string;
  body: string;
};

type KidsObjectCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

type KidsLessonCard = {
  key: string;
  label: string;
  imageSrc: string;
};

const PROMPTS = [
  'My mood today is...',
  'Something happened today that made me...',
  'I keep thinking about...',
  'Today I realized...',
  'I want to say this in English...',
];

const KIDS_OBJECT_KEYS = [
  'airplane',
  'apple',
  'bag',
  'ball',
  'banana',
  'bathtub',
  'bed',
  'bicycle',
  'bird',
  'blanket',
  'boat',
  'book',
  'bottle',
  'bus',
  'cat',
  'chair',
  'clock',
  'cloud',
  'cup',
  'dog',
  'doll',
  'door',
  'duck',
  'fish',
  'flower',
  'hat',
  'house',
  'key',
  'leaf',
  'milk',
  'moon',
  'orange',
  'pencil',
  'phone',
  'pillow',
  'plate',
  'rainbow',
  'shirt',
  'shoes',
  'soap',
  'sock',
  'spoon',
  'star',
  'sun',
  'table',
  'teddy-bear',
  'toothbrush',
  'toy-car',
  'tree',
  'window',
  'ant',
  'baby-bib',
  'backpack',
  'balloon',
  'bee',
  'bell',
  'block',
  'butterfly',
  'cake',
  'candle',
  'carrot',
  'cookie',
  'cow',
  'crayon',
  'dinosaur',
  'elephant',
  'envelope',
  'frog',
  'gift-box',
  'grapes',
  'hammer',
  'helicopter',
  'ice-cream',
  'jar',
  'kite',
  'lamp',
  'lion',
  'lollipop',
  'monkey',
  'mouse',
  'mushroom',
  'pear',
  'pig',
  'pizza',
  'rabbit',
  'rocket',
  'sandwich',
  'sheep',
  'strawberry',
  'train',
  'truck',
  'turtle',
  'watermelon',
  'whistle',
  'mitten',
  'scarf',
  'drum',
  'bear-face',
  'juice-box',
  'juice',
] as const;

const KIDS_UNCOUNTABLE_KEYS = new Set<string>([
  'milk',
  'soap',
  'juice',
  'ice-cream',
]);

const KIDS_EXTRA_ALIASES: Record<string, string[]> = {
  'teddy-bear': ['teddy bear', 'bear'],
  'toy-car': ['toy car', 'car'],
  'baby-bib': ['baby bib', 'bib'],
  backpack: ['back pack'],
  'gift-box': ['gift box', 'gift'],
  'ice-cream': ['ice cream'],
  'juice-box': ['juice box'],
  'bear-face': ['bear face', 'bear'],
};

const PAGE_2_IMAGE_FILENAMES = [
  'p2_001_what_is_this_apple.png',
  'p2_002_what_is_this_ball.png',
  'p2_003_what_is_this_dog.png',
  'p2_004_what_is_this_cat.png',
  'p2_005_what_is_this_book.png',
  'p2_006_what_is_this_car.png',
  'p2_007_it_is_an_apple.png',
  'p2_008_it_is_a_ball.png',
  'p2_009_it_is_a_dog.png',
  'p2_010_it_is_a_cat.png',
  'p2_011_i_want_water.png',
  'p2_012_i_want_milk.png',
  'p2_013_i_want_juice.png',
  'p2_014_i_want_an_apple.png',
  'p2_015_i_want_my_ball.png',
  'p2_016_i_am_happy.png',
  'p2_017_i_am_sad.png',
  'p2_018_i_am_sleepy.png',
  'p2_019_clap_your_hands.png',
  'p2_020_jump_up.png',
  'p2_021_sit_down.png',
  'p2_022_stand_up.png',
  'p2_023_come_here.png',
  'p2_024_lets_go.png',
  'p2_025_thank_you.png',
  'p2_026_youre_welcome.png',
  'p2_027_good_morning.png',
  'p2_028_good_night.png',
  'p2_029_the_ball_is_on_the_table.png',
  'p2_030_the_teddy_is_under_the_chair.png',
] as const;

const PAGE_3_IMAGE_FILENAMES = [
  'k001_hello_mercy.png',
  'k002_bye_bye.png',
  'k003_apple.png',
  'k004_ball.png',
  'k005_dog.png',
  'k006_cat.png',
  'k007_cup.png',
  'k008_book.png',
  'k009_car.png',
  'k010_star.png',
  'k011_teddy_bear.png',
  'k012_bed.png',
  'k013_chair.png',
  'k014_spoon.png',
  'k015_bottle.png',
  'k016_my_banana.png',
  'k017_hat.png',
  'k018_shoes.png',
  'k019_sun.png',
  'k020_moon.png',
  'k021_happy.png',
  'k022_sad.png',
  'k023_sleepy.png',
  'k024_hungry.png',
  'k025_clap.png',
  'k026_jump.png',
  'k027_sit_down.png',
  'k028_stand_up.png',
  'k029_come_here.png',
  'k030_lets_go.png',
  'k031_what_is_this.png',
  'k032_it_is_apple.png',
  'k033_it_is_banana.png',
  'k034_it_is_bird.png',
  'k035_it_is_fish.png',
  'k036_it_is_flower.png',
  'k037_it_is_bus.png',
  'k038_it_is_boat.png',
  'k039_it_is_tree.png',
  'k040_it_is_rainbow.png',
  'k041_i_want_water.png',
  'k042_i_want_milk.png',
  'k043_i_want_juice.png',
  'k044_i_want_apple.png',
  'k045_i_want_cookie.png',
  'k046_i_want_my_ball.png',
  'k047_i_want_teddy_bear.png',
  'k048_i_want_to_play.png',
  'k049_i_want_to_eat.png',
  'k050_i_want_to_sleep.png',
  'k051_how_are_you.png',
  'k052_im_fine.png',
  'k053_im_happy_today.png',
  'k054_im_tired.png',
  'k055_im_okay.png',
  'k056_thank_you.png',
  'k057_youre_welcome.png',
  'k058_good_morning.png',
  'k059_good_night.png',
  'k060_see_you_again.png',
  'k061_do_you_like_apples.png',
  'k062_yes_i_do.png',
  'k063_no_i_dont.png',
  'k064_i_like_cats.png',
  'k065_i_like_dogs.png',
  'k066_i_like_ice_cream.png',
  'k067_i_dont_like_spicy_food.png',
  'k068_this_one_please.png',
  'k069_that_one_please.png',
  'k070_i_want_the_red_one.png',
  'k071_this_is_my_mom.png',
  'k072_this_is_my_dad.png',
  'k073_this_is_my_baby_brother.png',
  'k074_we_are_at_home.png',
  'k075_i_am_in_my_room.png',
  'k076_where_is_my_toy.png',
  'k077_here_it_is.png',
  'k078_on_the_table.png',
  'k079_under_the_chair.png',
  'k080_come_and_help_me.png',
  'k081_what_is_your_name.png',
  'k082_my_name_is_emma.png',
  'k083_how_old_are_you.png',
  'k084_i_am_six_years_old.png',
  'k085_i_go_to_school.png',
  'k086_i_read_a_book.png',
  'k087_i_write_my_name.png',
  'k088_i_brush_my_teeth.png',
  'k089_i_eat_breakfast.png',
  'k090_i_go_to_bed.png',
  'k091_how_are_you_today.png',
  'k092_im_fine_thank_you.png',
  'k093_what_do_you_want_to_eat.png',
  'k094_i_want_rice_and_chicken.png',
  'k095_can_you_help_me.png',
  'k096_yes_i_can.png',
  'k097_where_are_you_going.png',
  'k098_i_am_going_home.png',
  'k099_what_are_you_doing.png',
  'k100_i_am_playing_with_my_friend.png',
] as const;

const PAGE_5_KEYS = [
  'k5_001_i_can_jump','k5_002_i_can_run','k5_003_i_can_sing','k5_004_i_can_read','k5_005_i_can_draw',
  'k5_006_i_can_swim','k5_007_i_can_dance','k5_008_i_can_ride_a_bike','k5_009_i_can_write','k5_010_i_can_count',
  'k5_011_i_can_clap','k5_012_i_can_wave','k5_013_i_can_cook','k5_014_i_can_climb','k5_015_i_can_kick',
  'k5_016_i_can_throw','k5_017_i_can_catch','k5_018_i_can_build','k5_019_i_can_fold','k5_020_i_can_pour',
  'k5_021_i_can_wash','k5_022_i_can_dress','k5_023_i_can_zip','k5_024_i_can_tie','k5_025_i_can_hop',
  'k5_026_i_can_skip','k5_027_i_can_spin','k5_028_i_can_roll','k5_029_i_can_crawl','k5_030_i_can_stretch',
  'k5_031_i_can_bend','k5_032_i_can_lift','k5_033_i_can_carry','k5_034_i_can_find','k5_035_i_can_show',
  'k5_036_i_can_give','k5_037_i_can_share','k5_038_i_can_help','k5_039_i_can_bounce','k5_040_i_can_slide',
  'k5_041_i_can_swing','k5_042_i_can_dig','k5_043_i_can_plant','k5_044_i_can_water','k5_045_i_can_cut',
  'k5_046_i_can_paste','k5_047_i_can_draw_a_picture','k5_048_i_can_whistle','k5_049_i_can_snap_fingers','k5_050_i_can_wink',
  'k5_051_i_can_nod','k5_052_i_can_blink','k5_053_i_can_blow','k5_054_i_can_point','k5_055_i_can_look',
  'k5_056_i_can_listen','k5_057_i_can_smell','k5_058_i_can_taste','k5_059_i_can_touch','k5_060_i_can_hide',
  'k5_061_i_can_pick_up','k5_062_i_can_put_down','k5_063_i_can_fill','k5_064_i_can_empty','k5_065_i_can_brush_teeth',
  'k5_066_i_can_comb_hair','k5_067_i_can_button','k5_068_i_can_push','k5_069_i_can_pull','k5_070_i_can_fix',
  'k5_071_i_can_break','k5_072_i_can_open','k5_073_i_can_close','k5_074_i_can_drop','k5_075_i_can_rest',
  'k5_076_i_can_walk','k5_077_i_can_catch_a_butterfly','k5_078_i_can_count_to_five','k5_079_i_can_share_a_cookie','k5_080_i_can_do_it',
] as const;

const PAGE_6_KEYS = [
  'k6_001_clap_your_hands','k6_002_sit_down','k6_003_stand_up','k6_004_come_here','k6_005_go_back',
  'k6_006_open_the_book','k6_007_close_the_door','k6_008_touch_your_head','k6_009_raise_your_hand','k6_010_turn_around',
  'k6_011_jump_up','k6_012_wave_hello','k6_013_point_to_the_window','k6_014_pick_it_up','k6_015_put_it_down',
  'k6_016_shake_your_head','k6_017_nod_your_head','k6_018_stomp_your_feet','k6_019_touch_your_nose','k6_020_open_your_mouth',
  'k6_021_close_your_eyes','k6_022_spin_around','k6_023_bend_your_knees','k6_024_stretch_your_arms','k6_025_take_a_step',
  'k6_026_run_in_place','k6_027_freeze','k6_028_whisper','k6_029_shout','k6_030_tiptoe',
  'k6_031_march','k6_032_hop_on_one_foot','k6_033_clap_three_times','k6_034_touch_your_toes','k6_035_reach_up_high',
  'k6_036_crouch_down','k6_037_clap_above_your_head','k6_038_touch_your_ears','k6_039_pat_your_head','k6_040_rub_your_tummy',
  'k6_041_wiggle_your_fingers','k6_042_stamp_your_foot','k6_043_touch_the_floor','k6_044_look_up','k6_045_look_down',
  'k6_046_roll_your_shoulders','k6_047_swing_your_arms','k6_048_smile','k6_049_show_me_your_hands','k6_050_say_hello',
  'k6_051_say_goodbye','k6_052_count_with_me','k6_053_listen_carefully','k6_054_look_at_me','k6_055_sit_like_a_frog',
  'k6_056_fly_like_a_bird','k6_057_walk_slowly','k6_058_walk_fast','k6_059_jump_like_a_frog','k6_060_great_job',
] as const;

const PAGE_7_KEYS = [
  'k7_001_excited','k7_002_bored','k7_003_surprised','k7_004_nervous','k7_005_proud',
  'k7_006_confused','k7_007_silly','k7_008_calm','k7_009_loved','k7_010_tired',
  'k7_011_hungry','k7_012_thirsty','k7_013_hot','k7_014_cold','k7_015_sick',
  'k7_016_better','k7_017_scared','k7_018_brave','k7_019_grateful','k7_020_embarrassed',
  'k7_021_curious','k7_022_lonely','k7_023_hopeful','k7_024_frustrated','k7_025_relieved',
  'k7_026_disgusted','k7_027_shy','k7_028_jealous','k7_029_peaceful','k7_030_angry',
  'k7_031_happy','k7_032_sad','k7_033_very_happy','k7_034_a_little_sad','k7_035_very_scared',
  'k7_036_a_little_scared','k7_037_so_excited','k7_038_not_happy','k7_039_surprised_and_happy','k7_040_tired_and_happy',
  'k7_041_feeling_good','k7_042_not_feeling_well','k7_043_full','k7_044_proud_of_myself','k7_045_miss_someone',
  'k7_046_want_to_play','k7_047_dont_want_to','k7_048_ouch','k7_049_yay','k7_050_aww',
  'k7_051_uh_oh','k7_052_no_no_no','k7_053_yes_yes_yes','k7_054_i_dont_know','k7_055_wow',
  'k7_056_sleepy','k7_057_loving','k7_058_grumpy','k7_059_cozy','k7_060_peaceful',
] as const;

const PAGE_8_KEYS = [
  'k8_001_hello','k8_002_hi','k8_003_good_morning','k8_004_good_afternoon','k8_005_good_night',
  'k8_006_how_are_you','k8_007_i_am_fine','k8_008_i_am_happy','k8_009_i_am_tired','k8_010_i_am_okay',
  'k8_011_i_am_great','k8_012_thank_you','k8_013_youre_welcome','k8_014_please','k8_015_sorry',
  'k8_016_excuse_me','k8_017_bye','k8_018_see_you_later','k8_019_see_you_tomorrow','k8_020_what_is_your_name',
  'k8_021_my_name_is','k8_022_how_old_are_you','k8_023_i_am_five_years_old','k8_024_can_i_help_you','k8_025_yes_please',
  'k8_026_no_thank_you','k8_027_do_you_like_it','k8_028_i_like_it_very_much','k8_029_what_do_you_want','k8_030_i_want_water',
  'k8_031_let_us_play','k8_032_are_you_ready','k8_033_come_and_play_with_me','k8_034_that_is_so_funny','k8_035_you_are_my_friend',
  'k8_036_can_you_help_me','k8_037_i_can_help_you','k8_038_sharing_is_caring','k8_039_i_missed_you','k8_040_we_are_friends',
] as const;

const PAGE_9_KEYS = [
  'k9_001_wake_up','k9_002_open_eyes','k9_003_stretch_in_bed','k9_004_get_out_of_bed','k9_005_go_to_the_bathroom',
  'k9_006_wash_face','k9_007_brush_teeth','k9_008_rinse_mouth','k9_009_dry_face','k9_010_comb_hair',
  'k9_011_take_off_pajamas','k9_012_put_on_shirt','k9_013_put_on_shorts','k9_014_put_on_socks','k9_015_put_on_shoes',
  'k9_016_eat_breakfast','k9_017_drink_milk','k9_018_drink_water','k9_019_eat_bread','k9_020_finish_breakfast',
  'k9_021_pack_school_bag','k9_022_put_on_backpack','k9_023_say_goodbye_to_mom','k9_024_go_to_school','k9_025_arrive_at_school',
  'k9_026_go_to_class','k9_027_sit_at_desk','k9_028_take_out_books','k9_029_listen_to_teacher','k9_030_raise_hand',
  'k9_031_read_a_book','k9_032_write_in_notebook','k9_033_draw_a_picture','k9_034_learn_new_words','k9_035_answer_a_question',
  'k9_036_eat_lunch','k9_037_drink_juice_at_lunch','k9_038_talk_to_friends','k9_039_play_outside','k9_040_run_and_play',
  'k9_041_drink_water_outside','k9_042_rest_a_little','k9_043_go_back_to_class','k9_044_pack_up_to_go_home','k9_045_say_goodbye_at_school',
  'k9_046_walk_home','k9_047_arrive_home','k9_048_take_off_shoes','k9_049_put_down_backpack','k9_050_change_clothes',
  'k9_051_wash_hands','k9_052_eat_a_snack','k9_053_drink_juice','k9_054_do_homework','k9_055_read_at_home',
  'k9_056_play_with_toys','k9_057_watch_something','k9_058_help_at_home','k9_059_eat_dinner','k9_060_drink_water_at_dinner',
  'k9_061_help_clear_table','k9_062_take_a_bath','k9_063_wash_hair','k9_064_rinse_off','k9_065_dry_off',
  'k9_066_put_on_pajamas','k9_067_brush_teeth_at_night','k9_068_drink_water_before_bed','k9_069_read_a_bedtime_story','k9_070_say_goodnight',
  'k9_071_turn_off_the_light','k9_072_lie_down','k9_073_close_eyes','k9_074_sleep','k9_075_dream',
  'k9_076_wake_up_again','k9_077_feel_fresh','k9_078_look_outside','k9_079_say_good_morning','k9_080_ready_for_the_day',
] as const;

const PAGE_4_KEYS = [
  'k4_001_jump','k4_002_run','k4_003_walk','k4_004_clap','k4_005_wave',
  'k4_006_dance','k4_007_eat','k4_008_drink','k4_009_sleep','k4_010_read',
  'k4_011_write','k4_012_draw','k4_013_open','k4_014_close','k4_015_push',
  'k4_016_pull','k4_017_kick','k4_018_throw','k4_019_catch','k4_020_swim',
  'k4_021_sing','k4_022_laugh','k4_023_cry','k4_024_hug','k4_025_point',
  'k4_026_sit','k4_027_stand','k4_028_bend','k4_029_stretch','k4_030_spin',
  'k4_031_hop','k4_032_skip','k4_033_crawl','k4_034_roll','k4_035_climb',
  'k4_036_slide','k4_037_swing','k4_038_dig','k4_039_plant','k4_040_water',
  'k4_041_cook','k4_042_cut','k4_043_paste','k4_044_fold','k4_045_count',
  'k4_046_build','k4_047_break','k4_048_fix','k4_049_carry','k4_050_lift',
  'k4_051_drop','k4_052_pick_up','k4_053_put_down','k4_054_pour','k4_055_fill',
  'k4_056_empty','k4_057_wash','k4_058_dry','k4_059_brush','k4_060_comb',
  'k4_061_dress','k4_062_undress','k4_063_zip','k4_064_button','k4_065_tie',
  'k4_066_kick_ball','k4_067_bounce','k4_068_roll_ball','k4_069_catch_butterfly','k4_070_look',
  'k4_071_listen','k4_072_smell','k4_073_taste','k4_074_touch','k4_075_hide',
  'k4_076_find','k4_077_show','k4_078_give','k4_079_take','k4_080_rest',
] as const;

const PAGE_10_KEYS = [
  'k10_001_red','k10_002_blue','k10_003_yellow','k10_004_green','k10_005_orange',
  'k10_006_purple','k10_007_pink','k10_008_white','k10_009_black','k10_010_brown',
  'k10_011_one','k10_012_two','k10_013_three','k10_014_four','k10_015_five',
  'k10_016_six','k10_017_seven','k10_018_eight','k10_019_nine','k10_020_ten',
  'k10_021_eleven','k10_022_twelve','k10_023_thirteen','k10_024_fourteen','k10_025_fifteen',
  'k10_026_sixteen','k10_027_seventeen','k10_028_eighteen','k10_029_nineteen','k10_030_twenty',
  'k10_031_one_apple','k10_032_two_dogs','k10_033_three_cats','k10_034_four_flowers','k10_035_five_birds',
  'k10_036_one_sun','k10_037_two_moons','k10_038_three_stars','k10_039_four_hearts','k10_040_five_butterflies',
  'k10_041_red_apple','k10_042_blue_sky','k10_043_yellow_sun','k10_044_green_frog','k10_045_orange_carrot',
  'k10_046_purple_grapes','k10_047_pink_flower','k10_048_white_cloud','k10_049_black_umbrella','k10_050_brown_bear',
  'k10_051_count_with_fingers','k10_052_one_big_two_small','k10_053_more_or_less','k10_054_same_number','k10_055_count_the_dots',
  'k10_056_rainbow','k10_057_many_colors','k10_058_favorite_color','k10_059_colors_and_numbers','k10_060_i_know_my_colors',
] as const;

const PAGE_11_KEYS = [
  'k11_001_dog','k11_002_cat','k11_003_rabbit','k11_004_hamster','k11_005_fish',
  'k11_006_cow','k11_007_pig','k11_008_horse','k11_009_sheep','k11_010_duck',
  'k11_011_hen','k11_012_goat','k11_013_lion','k11_014_elephant','k11_015_tiger',
  'k11_016_giraffe','k11_017_monkey','k11_018_zebra','k11_019_hippo','k11_020_dolphin',
  'k11_021_whale','k11_022_crab','k11_023_turtle','k11_024_octopus','k11_025_seahorse',
  'k11_026_butterfly','k11_027_bee','k11_028_parrot','k11_029_owl','k11_030_eagle',
  'k11_031_penguin','k11_032_flamingo','k11_033_crocodile','k11_034_snake','k11_035_frog',
  'k11_036_panda','k11_037_koala','k11_038_kangaroo','k11_039_bear','k11_040_fox',
  'k11_041_deer','k11_042_raccoon','k11_043_squirrel','k11_044_mouse','k11_045_sheep_baby',
  'k11_046_chick','k11_047_puppy','k11_048_kitten','k11_049_piglet','k11_050_calf',
  'k11_051_duckling','k11_052_caterpillar','k11_053_snail','k11_054_ladybug','k11_055_ant',
  'k11_056_spider','k11_057_worm','k11_058_goldfish_in_bowl','k11_059_bird_on_branch','k11_060_animals_together',
] as const;

const PAGE_12_KEYS = [
  'k12_001_head','k12_002_hair','k12_003_face','k12_004_eyes','k12_005_ears',
  'k12_006_nose','k12_007_mouth','k12_008_teeth','k12_009_tongue','k12_010_neck',
  'k12_011_shoulders','k12_012_arms','k12_013_elbow','k12_014_hands','k12_015_fingers',
  'k12_016_nails','k12_017_chest','k12_018_tummy','k12_019_back','k12_020_belly_button',
  'k12_021_legs','k12_022_knees','k12_023_feet','k12_024_toes','k12_025_heels',
  'k12_026_thumb','k12_027_forehead','k12_028_cheeks','k12_029_chin','k12_030_eyebrows',
  'k12_031_eyelashes','k12_032_lips','k12_033_wrist','k12_034_ankle','k12_035_hip',
  'k12_036_waist','k12_037_skin','k12_038_my_right_hand','k12_039_my_left_hand','k12_040_my_right_foot',
  'k12_041_my_left_foot','k12_042_clap_your_hands','k12_043_stomp_your_feet','k12_044_touch_your_nose','k12_045_pat_your_head',
  'k12_046_rub_your_tummy','k12_047_shake_your_head','k12_048_wiggle_your_fingers','k12_049_my_whole_body','k12_050_i_love_my_body',
] as const;

const PAGE_13_KEYS = [
  'k13_001_mom','k13_002_dad','k13_003_grandma','k13_004_grandpa','k13_005_baby',
  'k13_006_sister','k13_007_brother','k13_008_teacher','k13_009_friend','k13_010_doctor',
  'k13_011_this_is_my_mom','k13_012_this_is_my_dad','k13_013_this_is_my_grandma','k13_014_this_is_my_grandpa','k13_015_this_is_my_baby',
  'k13_016_my_family','k13_017_i_love_my_mom','k13_018_i_love_my_dad','k13_019_i_love_my_grandma','k13_020_i_love_my_grandpa',
  'k13_021_mom_is_cooking','k13_022_dad_is_working','k13_023_grandma_is_gardening','k13_024_grandpa_is_reading','k13_025_baby_is_sleeping',
  'k13_026_my_teacher','k13_027_my_friend','k13_028_hello_friend','k13_029_come_and_play','k13_030_new_friend',
  'k13_031_neighbor','k13_032_helper','k13_033_baby_brother','k13_034_big_sister','k13_035_little_sister',
  'k13_036_twins','k13_037_family_dinner','k13_038_family_walk','k13_039_family_hug','k13_040_i_love_my_family',
] as const;

type KidsPageConfig = {
  id: KidsPageId;
  label: string;
};

const KIDS_PAGE_CONFIGS: KidsPageConfig[] = [
  { id: 'page1', label: 'Page 1' },
  { id: 'page2', label: 'Page 2' },
  { id: 'page3', label: 'Page 3' },
  { id: 'page4', label: 'Page 4' },
  { id: 'page5', label: 'Page 5' },
  { id: 'page6', label: 'Page 6' },
  { id: 'page7', label: 'Page 7' },
  { id: 'page8', label: 'Page 8' },
  { id: 'page9', label: 'Page 9' },
  { id: 'page10', label: 'Page 10' },
  { id: 'page11', label: 'Page 11' },
  { id: 'page12', label: 'Page 12' },
  { id: 'page13', label: 'Page 13' },
  { id: 'page14', label: 'Page 14' },
  { id: 'page15', label: 'Page 15' },
  { id: 'page16', label: 'Page 16' },
  { id: 'page17', label: 'Page 17' },
  { id: 'page18', label: 'Page 18' },
  { id: 'page19', label: 'Page 19' },
  { id: 'page20', label: 'Page 20' },
  { id: 'page21', label: 'Page 21' },
  { id: 'page22', label: 'Page 22' },
  { id: 'page23', label: 'Page 23' },
  { id: 'page24', label: 'Page 24' },
  { id: 'page25', label: 'Page 25' },
  { id: 'page26', label: 'Page 26' },
  { id: 'page27', label: 'Page 27' },
  { id: 'page28', label: 'Page 28 — Age 12+' },
  { id: 'page29', label: 'Page 29 — Age 12+' },
  { id: 'page30', label: 'Page 30 — Age 14' },
  { id: 'page31', label: 'Page 31 — Age 15' },
  { id: 'page32', label: 'Page 32 — Age 16' },
  { id: 'page33', label: 'Page 33 — Age 17' },
  { id: 'page34', label: 'Page 34 — Age 18' },
];

function toKidsLabel(key: string): string {
  return key
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function startsWithVowelSound(text: string): boolean {
  return /^[aeiou]/i.test(text.trim());
}

function toKidsSentence(key: string): string {
  const lowerLabel = toKidsLabel(key).toLowerCase();

  if (KIDS_UNCOUNTABLE_KEYS.has(key)) {
    return `This is ${lowerLabel}.`;
  }

  return `This is ${startsWithVowelSound(lowerLabel) ? 'an' : 'a'} ${lowerLabel}.`;
}

function toKidsAliases(key: string): string[] {
  const normalized = key.replace(/-/g, ' ');
  const label = toKidsLabel(key).toLowerCase();
  const extra = KIDS_EXTRA_ALIASES[key] ?? [];

  return Array.from(new Set([key, normalized, label, ...extra]));
}

function toPage2Label(filename: string): string {
  return filename
    .replace(/^p2_\d+_/, '')
    .replace(/\.png$/i, '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toPage3Label(filename: string): string {
  return filename
    .replace(/^k\d+_/, '')
    .replace(/\.png$/i, '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toGenericPageLabel(key: string): string {
  return key
    .replace(/^k\d+_\d+_/, '')
    .replace(/^k\d+_/, '')
    .split('_')
    .map((part) => {
      if (part === 'i') return 'I';
      if (part === 'im') return "I'm";
      if (part === 'youre') return "You're";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function asText(value: unknown): string {
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(', ');
  }

  if (value && typeof value === 'object') {
    const maybeBilingual = value as BilingualText;

    if (typeof maybeBilingual.en === 'string' && maybeBilingual.en.trim()) {
      return maybeBilingual.en;
    }

    if (typeof maybeBilingual.vi === 'string' && maybeBilingual.vi.trim()) {
      return maybeBilingual.vi;
    }
  }

  if (value == null) return '';

  try {
    return String(value);
  } catch {
    return '';
  }
}

function cleanText(value: unknown): string {
  return asText(value).replace(/\s+/g, ' ').trim();
}

function normalizeLearningSupportMode(value?: string | null): LearningSupportMode {
  const normalized = cleanText(value).toLowerCase();

  if (normalized === 'guided') return 'guided';
  if (normalized === 'immersion') return 'immersion';
  return 'gentle';
}

function mapResult(value?: GrammarApiResponse | null): TeacherDisplayResult | null {
  if (!value) return null;

  return {
    correctedText: value.correctedText,
    enhancedText: value.enhancedText,
    explanation: value.explanation,
    grammarPoints: Array.isArray((value as any).grammarPoints)
      ? (value as any).grammarPoints
      : [],
    tense: (value as any).tenseAnalysis?.likelyMainTense,
  };
}

function formatWritingMode(value?: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMemoryIcon(type: TeacherMemorySummaryItem['type']) {
  switch (type) {
    case 'strength':
      return <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />;
    case 'focus':
      return <Target className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />;
    case 'logic':
      return <Brain className="mt-0.5 h-4.5 w-4.5 shrink-0 text-violet-500" />;
    case 'pronunciation':
      return <Mic className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sky-500" />;
    default:
      return <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />;
  }
}

function getStepCardStyles(step: 'express' | 'improve' | 'speak' | 'understand') {
  switch (step) {
    case 'express':
      return {
        border: 'border-l-[#FF8A65]',
        label: 'text-[#D66A4E]',
        badge: 'bg-[#FFF1EC] text-[#D66A4E] border-[#FFD4C6]',
      };
    case 'improve':
      return {
        border: 'border-l-[#34D399]',
        label: 'text-[#0F9F6E]',
        badge: 'bg-[#ECFDF5] text-[#0F9F6E] border-[#B7F0D3]',
      };
    case 'speak':
      return {
        border: 'border-l-[#60A5FA]',
        label: 'text-[#2563EB]',
        badge: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      };
    case 'understand':
      return {
        border: 'border-l-[#C084FC]',
        label: 'text-[#9333EA]',
        badge: 'bg-[#F5F3FF] text-[#9333EA] border-[#DDD6FE]',
      };
    default:
      return {
        border: 'border-l-slate-300',
        label: 'text-slate-600',
        badge: 'bg-slate-50 text-slate-600 border-slate-200',
      };
  }
}

function getJourneySteps(params: {
  latestWriting: string;
  hasAnalysis: boolean;
  hasLogicMemory: boolean;
  hasPronunciationMemory: boolean;
}): JourneyStepStatus[] {
  const { latestWriting, hasAnalysis, hasLogicMemory, hasPronunciationMemory } = params;

  return [
    {
      key: 'express',
      title: 'Express',
      caption: latestWriting ? 'You gave Mercy a real sentence.' : 'Write one real sentence.',
      done: Boolean(latestWriting),
    },
    {
      key: 'improve',
      title: 'Improve',
      caption: hasAnalysis
        ? 'Mercy already shaped the sentence.'
        : 'Open Grammar to improve it.',
      done: hasAnalysis,
    },
    {
      key: 'speak',
      title: 'Speak',
      caption: hasPronunciationMemory
        ? 'Mercy already remembers a speaking pattern here.'
        : hasAnalysis
          ? 'Practice the improved line aloud.'
          : 'Speak becomes stronger after Grammar.',
      done: hasPronunciationMemory,
    },
    {
      key: 'understand',
      title: 'Understand',
      caption: hasLogicMemory
        ? 'Mercy already remembers the sentence pattern.'
        : 'Logic will explain the sentence pattern.',
      done: hasLogicMemory,
    },
  ];
}

function pickFirstMemoryLabel(
  items: TeacherMemorySummaryItem[],
  type: TeacherMemorySummaryItem['type'],
): string {
  return cleanText(items.find((item) => item.type === type)?.label);
}

function buildLockedJourneyPreview(params: {
  latestWriting: string;
  focusText: string;
  hasAnalysis: boolean;
  hasMemory: boolean;
  enhancedText: string;
  correctedText: string;
}): ProgressNote[] {
  const { latestWriting, focusText, hasAnalysis, hasMemory, enhancedText, correctedText } = params;

  return [
    {
      title: 'Your sentence',
      body: latestWriting || 'Start with one honest sentence and Mercy will build from there.',
    },
    {
      title: 'What Journey unlocks',
      body:
        enhancedText || correctedText
          ? 'See your improved sentence, your teacher progress note, and the next best step in one place.'
          : 'See your latest sentence turn into a guided lesson with coaching, speaking direction, and understanding support.',
    },
    {
      title: 'What Mercy remembers',
      body: hasMemory
        ? 'Journey brings together strengths, focus patterns, and sentence logic so learning does not reset each time.'
        : 'As you use Grammar, Speak, and Logic, Journey starts remembering your patterns and coaching you personally.',
    },
    {
      title: 'Next step',
      body: hasAnalysis
        ? 'Unlock Journey to keep this sentence moving through memory-based coaching.'
        : focusText
          ? `Unlock Journey to turn ${focusText} into a guided learning path.`
          : 'Unlock Journey to see the full teacher layer, not just separate tools.',
    },
  ];
}

function gentleFocusVi(focusText: string): string {
  const lower = focusText.toLowerCase();
  const parts: string[] = [];

  if (lower.includes('reason connector')) parts.push('liên từ nối ý, nhất là cách nối lý do cho rõ hơn');
  if (lower.includes('sentence structure')) parts.push('cấu trúc câu rõ ràng và thẳng ý hơn');
  if (lower.includes('past tense')) parts.push('quá khứ đơn');
  if (lower.includes('present simple')) parts.push('hiện tại đơn');
  if (lower.includes('present perfect')) parts.push('hiện tại hoàn thành');
  if (!parts.length) parts.push('diễn đạt câu tiếng Anh tự nhiên hơn');

  return `👉 Điểm đang luyện: ${parts.join(' + ')}.`;
}

function guidedFocusVi(focusText: string): string {
  const lower = focusText.toLowerCase();

  if (lower.includes('reason connector') && lower.includes('sentence structure')) {
    return 'Gợi ý ngắn: đang luyện liên từ + cấu trúc câu.';
  }
  if (lower.includes('past tense')) return 'Gợi ý ngắn: chú ý quá khứ đơn.';
  if (lower.includes('present simple')) return 'Gợi ý ngắn: chú ý hiện tại đơn.';
  if (lower.includes('present perfect')) return 'Gợi ý ngắn: chú ý hiện tại hoàn thành.';

  return 'Gợi ý ngắn: Mercy đang làm câu rõ và tự nhiên hơn.';
}

function supportLine(
  mode: LearningSupportMode,
  gentle: string,
  guided?: string,
) {
  if (mode === 'immersion') return '';
  if (mode === 'guided') return guided || gentle;
  return gentle;
}

function buildPage1Items(): KidsLessonCard[] {
  return KIDS_OBJECT_KEYS.map((key) => ({
    key,
    label: toKidsLabel(key),
    imageSrc: `/images/mercy-kids/${key}.jpg`,
  }));
}

function buildPage2Items(): KidsLessonCard[] {
  return PAGE_2_IMAGE_FILENAMES.map((filename) => ({
    key: filename.replace(/\.png$/i, ''),
    label: toPage2Label(filename),
    imageSrc: `/images/mercy-kids-page-2/${filename}`,
  }));
}

function buildPage3Items(): KidsLessonCard[] {
  return PAGE_3_IMAGE_FILENAMES.map((filename) => ({
    key: filename.replace(/\.png$/i, ''),
    label: toPage3Label(filename),
    imageSrc: `/images/mercy-kids-page-3/${filename}`,
  }));
}

function buildGenericPageItems(
  keys: readonly string[],
  imageFolder: string,
): KidsLessonCard[] {
  return keys.map((key) => ({
    key,
    label: toGenericPageLabel(key),
    imageSrc: `${imageFolder}/${key}.png`,
  }));
}

function buildMappedPageItems(
  items: ReadonlyArray<{ key: string; label: string; image: string }>,
): KidsLessonCard[] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
    imageSrc: item.image,
  }));
}

function resolveCurrentPageItems(page: KidsPageId): KidsLessonCard[] {
  switch (page) {
    case 'page1':
      return buildPage1Items();
    case 'page2':
      return buildPage2Items();
    case 'page3':
      return buildPage3Items();
    case 'page4':
      return buildGenericPageItems(PAGE_4_KEYS, '/images/mercy-kids-page-4');
    case 'page5':
      return buildGenericPageItems(PAGE_5_KEYS, '/images/mercy-kids-page-5');
    case 'page6':
      return buildGenericPageItems(PAGE_6_KEYS, '/images/mercy-kids-page-6');
    case 'page7':
      return buildGenericPageItems(PAGE_7_KEYS, '/images/mercy-kids-page-7');
    case 'page8':
      return buildGenericPageItems(PAGE_8_KEYS, '/images/mercy-kids-page-8');
    case 'page9':
      return buildGenericPageItems(PAGE_9_KEYS, '/images/mercy-kids-page-9');
    case 'page10':
      return buildGenericPageItems(PAGE_10_KEYS, '/images/mercy-kids-page-10');
    case 'page11':
      return buildGenericPageItems(PAGE_11_KEYS, '/images/mercy-kids-page-11');
    case 'page12':
      return buildGenericPageItems(PAGE_12_KEYS, '/images/mercy-kids-page-12');
    case 'page13':
      return buildGenericPageItems(PAGE_13_KEYS, '/images/mercy-kids-page-13');
    case 'page14':
      return buildMappedPageItems(KID_PAGE_14_ITEMS);
    case 'page15':
      return buildMappedPageItems(KID_PAGE_15_ITEMS);
    case 'page16':
      return buildMappedPageItems(KID_PAGE_16_ITEMS);
    case 'page17':
      return buildMappedPageItems(KID_PAGE_17_ITEMS);
    case 'page18':
      return buildMappedPageItems(KID_PAGE_18_ITEMS);
    case 'page19':
      return buildMappedPageItems(KID_PAGE_19_ITEMS);
    case 'page20':
      return buildMappedPageItems(KID_PAGE_20_ITEMS);
    case 'page21':
      return buildMappedPageItems(KID_PAGE_21_ITEMS);
    case 'page22':
      return buildMappedPageItems(KID_PAGE_22_ITEMS);
    case 'page23':
      return buildMappedPageItems(KID_PAGE_23_ITEMS);
    case 'page24':
      return buildMappedPageItems(KID_PAGE_24_ITEMS);
    case 'page25':
      return buildMappedPageItems(KID_PAGE_25_ITEMS);
    case 'page26':
      return buildMappedPageItems(KID_PAGE_26_ITEMS);
    case 'page27':
      return buildMappedPageItems(KID_PAGE_27_ITEMS);
    case 'page28':
      return buildMappedPageItems(KID_PAGE_28_ITEMS);
    case 'page29':
      return buildMappedPageItems(KID_PAGE_29_ITEMS);
    case 'page30':
      return buildMappedPageItems(KID_PAGE_30_ITEMS);
    case 'page31':
      return buildMappedPageItems(KID_PAGE_31_ITEMS);
    case 'page32':
      return buildMappedPageItems(KID_PAGE_32_ITEMS);
    case 'page33':
      return buildMappedPageItems(KID_PAGE_33_ITEMS);
    case 'page34':
      return buildMappedPageItems(KID_PAGE_34_ITEMS);
    default:
      return buildPage1Items();
  }
}

const KIDS_CELEBRATE_STYLE_ID = 'mercy-kids-celebrate-style';
const KIDS_CELEBRATE_CSS = `
@keyframes mercyKidCelebrate {
  0%   { transform: scale(1)    rotate(0deg); }
  20%  { transform: scale(1.12) rotate(-6deg); }
  40%  { transform: scale(0.96) rotate(5deg); }
  60%  { transform: scale(1.08) rotate(-3deg); }
  80%  { transform: scale(0.99) rotate(2deg); }
  100% { transform: scale(1)    rotate(0deg); }
}
@keyframes mercyKidSparkle {
  0%   { box-shadow: 0 0 0 0 rgba(255,193,7,0.55); }
  60%  { box-shadow: 0 0 0 14px rgba(255,193,7,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,193,7,0); }
}
.mercy-kid-celebrate {
  animation: mercyKidCelebrate 600ms cubic-bezier(.34,1.56,.64,1),
             mercyKidSparkle 700ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .mercy-kid-celebrate { animation: none; }
}
`;

function useMercyKidsCelebrateStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(KIDS_CELEBRATE_STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = KIDS_CELEBRATE_STYLE_ID;
    el.textContent = KIDS_CELEBRATE_CSS;
    document.head.appendChild(el);
  }, []);
}

function KidsImageGrid({
  items,
  selectedKey,
  onSelect,
}: {
  items: KidsLessonCard[];
  selectedKey: string | null | undefined;
  onSelect?: (key: string) => void;
}) {
  useMercyKidsCelebrateStyles();

  const [celebratingKey, setCelebratingKey] = useState<string | null>(null);
  const celebrateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    };
  }, []);

  const handleTap = (key: string) => {
    onSelect?.(key);
    if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
    // Force animation restart even on the same key by clearing first.
    setCelebratingKey(null);
    requestAnimationFrame(() => setCelebratingKey(key));
    celebrateTimerRef.current = setTimeout(() => setCelebratingKey(null), 700);
  };

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {items.map((item) => {
        const isSelected = item.key === selectedKey;
        const isCelebrating = item.key === celebratingKey;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleTap(item.key)}
            className={`aspect-square w-full overflow-hidden rounded-xl border bg-white transition ${
              isSelected
                ? 'border-[#FFB39A] shadow-[0_8px_18px_rgba(255,138,101,0.18)]'
                : 'border-white/80 hover:border-[#FFD7C8] hover:shadow-[0_6px_14px_rgba(148,163,184,0.08)]'
            } ${isCelebrating ? 'mercy-kid-celebrate' : ''}`}
            aria-label={item.label}
            title={item.label}
            aria-pressed={isSelected}
          >
            <img
              src={item.imageSrc}
              alt={item.label}
              className="h-full w-full object-contain p-1.5 sm:p-2"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}

function KidsPageTabBar({
  activePage,
  onSelectPage,
}: {
  activePage: KidsPageId;
  onSelectPage: (page: KidsPageId) => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {KIDS_PAGE_CONFIGS.map((config) => {
        const isActive = config.id === activePage;

        return (
          <button
            key={config.id}
            type="button"
            onClick={() => onSelectPage(config.id)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
              isActive
                ? 'border-[#FFB39A] bg-gradient-to-r from-[#FFF1EA] to-[#FFF8F4] text-[#D66A4E] shadow-[0_4px_10px_rgba(255,138,101,0.14)]'
                : 'border-white/80 bg-white text-slate-500 hover:border-[#FFD7C8] hover:text-slate-700'
            }`}
            aria-pressed={isActive}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

export function MercyTeacherTab({
  latestTeacherWritingState,
  latestAnalysisResult,
  teacherMemorySummary = [],
  onOpenPronunciation,
  onOpenWriting,
  isLocked = false,
  onUnlock,
  unlockTitle = 'Unlock Mercy Journey',
  unlockDescription = 'Journey turns one real sentence into a personal teacher loop with memory, progress notes, and next-step coaching.',
  unlockButtonLabel = 'Unlock Journey',
  learningSupportMode = 'gentle',
  isKidsMode = false,
  disableTeacherWriting = false,
  selectedKidsObjectKey,
  onSelectKidsObject,
  selectedKidsPage = 'page1',
  onSelectKidsPage,
}: Props) {
  const mode = useMemo(
    () => normalizeLearningSupportMode(learningSupportMode),
    [learningSupportMode],
  );

  const analysisSource =
    latestAnalysisResult ?? latestTeacherWritingState?.latestAnalysisResult ?? null;

  const result = useMemo(() => mapResult(analysisSource), [analysisSource]);

  const correctedText = cleanText(result?.correctedText);
  const enhancedText = cleanText(result?.enhancedText);
  const explanationText = cleanText(result?.explanation);
  const tenseText = cleanText(result?.tense);
  const grammarPoints = (result?.grammarPoints ?? []).map(cleanText).filter(Boolean);

  const latestWriting = cleanText(latestTeacherWritingState?.latestSubmittedText);
  const writingMode = formatWritingMode(latestTeacherWritingState?.currentWritingMode);

  const hasAnalysis =
    Boolean(correctedText) ||
    Boolean(enhancedText) ||
    Boolean(explanationText) ||
    grammarPoints.length > 0 ||
    Boolean(tenseText);

  const hasMemory = teacherMemorySummary.length > 0;
  const hasLogicMemory = teacherMemorySummary.some((item) => item.type === 'logic');
  const hasPronunciationMemory = teacherMemorySummary.some(
    (item) => item.type === 'pronunciation',
  );

  const focusText = useMemo(() => {
    const teacherTask = latestTeacherWritingState?.teacherTask as
      | { focus?: unknown; emphasis?: unknown }
      | undefined;

    const explicitFocus = cleanText(teacherTask?.focus);
    if (explicitFocus) return explicitFocus;

    const emphasis = cleanText(teacherTask?.emphasis);
    if (emphasis) return emphasis;

    const focusLabel = pickFirstMemoryLabel(teacherMemorySummary, 'focus');
    if (focusLabel) return focusLabel;

    if (grammarPoints.length > 0) return grammarPoints[0];
    if (tenseText) return `${tenseText} tense`;
    return 'real English from your real thought';
  }, [grammarPoints, latestTeacherWritingState?.teacherTask, teacherMemorySummary, tenseText]);

  const coachingLead = useMemo(() => {
    if (teacherMemorySummary.length > 0) {
      const focusItem = teacherMemorySummary.find((item) => item.type === 'focus');
      const focusLabel = cleanText(focusItem?.label);
      // focusLabel already includes the "Current focus: …" prefix (built in
      // useMercyMemory). Returning it as-is avoids the duplicated prefix bug.
      if (focusLabel) return focusLabel;
    }

    if (focusText) return `Current focus: ${focusText}.`;

    return 'Start with one real thought, not a perfect sentence.';
  }, [focusText, teacherMemorySummary]);

  const quickCoach = useMemo(() => {
    if (!latestWriting) {
      return 'A short honest sentence is enough. Mercy will guide it step by step.';
    }

    if (enhancedText) {
      return 'Mercy already has a stronger version. Keep the same sentence moving.';
    }

    return 'You already started. Open Grammar and let Mercy shape the same sentence.';
  }, [enhancedText, latestWriting]);

  const primarySentence = enhancedText || correctedText || latestWriting;

  const journeySteps = useMemo(
    () =>
      getJourneySteps({
        latestWriting,
        hasAnalysis,
        hasLogicMemory,
        hasPronunciationMemory,
      }),
    [hasAnalysis, hasLogicMemory, hasPronunciationMemory, latestWriting],
  );

  const lockedPreviewNotes = useMemo(
    () =>
      buildLockedJourneyPreview({
        latestWriting,
        focusText,
        hasAnalysis,
        hasMemory,
        enhancedText,
        correctedText,
      }),
    [correctedText, enhancedText, focusText, hasAnalysis, hasMemory, latestWriting],
  );

  const expressStyles = getStepCardStyles('express');
  const improveStyles = getStepCardStyles('improve');
  const speakStyles = getStepCardStyles('speak');
  const understandStyles = getStepCardStyles('understand');

  const showWritingButton =
    typeof onOpenWriting === 'function' && !disableTeacherWriting && !isKidsMode;
  const showPronunciationButton = typeof onOpenPronunciation === 'function';

  const focusSupport = supportLine(
    mode,
    gentleFocusVi(focusText),
    guidedFocusVi(focusText),
  );

  const nextStepSupport = supportLine(
    mode,
    hasAnalysis
      ? '👉 Bước tiếp theo: đọc câu đã được cải thiện thành tiếng, rồi mở Logic để hiểu vì sao tiếng Anh dùng cấu trúc như vậy.'
      : '👉 Bước tiếp theo: mở Grammar trước để Mercy sửa chính câu này.',
    hasAnalysis
      ? 'Gợi ý ngắn: nói câu này trước, rồi mở Logic.'
      : 'Gợi ý ngắn: mở Grammar trước.',
  );

  const currentPageItems = useMemo(
    () => resolveCurrentPageItems(selectedKidsPage),
    [selectedKidsPage],
  );

  const handlePageSelect = (page: KidsPageId) => {
    if (page === selectedKidsPage) return;
    onSelectKidsPage?.(page);
    const firstItems = resolveCurrentPageItems(page);
    if (firstItems.length > 0) {
      onSelectKidsObject?.(firstItems[0].key);
    }
  };

  const [savePopup, setSavePopup] = useState<{
    itemType: NotebookItemType;
    contentEn: string;
  } | null>(null);

  const openSave = (itemType: NotebookItemType, contentEn: string) => {
    const trimmed = contentEn.trim();
    if (!trimmed) return;
    setSavePopup({ itemType, contentEn: trimmed });
  };

  if (isKidsMode) {
    return (
      <div className="m-0 flex h-full min-h-0 flex-1 overflow-hidden">
        <div
          className="h-full w-full overflow-y-auto overscroll-contain px-2 pb-3 pt-2 sm:px-3 sm:pb-4 sm:pt-3"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          <div className="mx-auto w-full max-w-[920px]">
            <KidsPageTabBar
              activePage={selectedKidsPage}
              onSelectPage={handlePageSelect}
            />

            <KidsImageGrid
              items={currentPageItems}
              selectedKey={selectedKidsObjectKey}
              onSelect={onSelectKidsObject}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-slate-50">
        <div className="relative p-3 md:p-4">
          <div className="relative space-y-4">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-2.5">
                      {isLocked ? (
                        <Lock className="h-5 w-5 text-slate-500" />
                      ) : (
                        <MessageCircleHeart className="h-5 w-5 text-slate-700" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
                        Teacher Mercy
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {isLocked
                          ? 'Unlock your teacher: explain, correct, guide, speak, and the next step.'
                          : 'Your main helper: explain, correct, guide, speak, and the next step.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                      {primarySentence ? '1 sentence active' : 'No sentence yet'}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                      Focus: {focusText}
                    </span>

                    {writingMode ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                        {writingMode}
                      </span>
                    ) : null}

                    {teacherMemorySummary.length > 0 ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                        {teacherMemorySummary.length} memory note
                        {teacherMemorySummary.length > 1 ? 's' : ''}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {showWritingButton ? (
                      <Button
                        type="button"
                        onClick={onOpenWriting}
                        className="h-10 rounded-2xl border-0 bg-gradient-to-r from-[#FF8A65] to-[#FF6F61] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,111,97,0.22)] hover:brightness-[1.03]"
                      >
                        <PenSquare className="mr-2.5 h-4.5 w-4.5" />
                        {latestWriting ? 'Open Grammar' : 'Start in Grammar'}
                      </Button>
                    ) : null}

                    {!isLocked && hasAnalysis && showPronunciationButton ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onOpenPronunciation}
                        className="h-10 rounded-2xl border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                      >
                        <Mic className="mr-2.5 h-4.5 w-4.5" />
                        Open Speak
                      </Button>
                    ) : null}

                    {isLocked && onUnlock ? (
                      <Button
                        type="button"
                        onClick={onUnlock}
                        className="h-10 rounded-2xl border-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(168,85,247,0.24)] hover:brightness-[1.03]"
                      >
                        <Crown className="mr-2.5 h-4.5 w-4.5" />
                        {unlockButtonLabel}
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:max-w-sm">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {isLocked ? 'Preview' : 'Current focus'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {isLocked
                          ? 'Teacher Mercy keeps your sentence, focus, and next step in one calm place.'
                          : coachingLead}
                      </p>
                      {!isLocked && focusSupport ? (
                        <p className="mt-1 text-sm leading-6 text-amber-700">
                          {focusSupport}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {isLocked
                          ? 'See the sentence, the pattern, and the next move together — without resetting.'
                          : quickCoach}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {isLocked ? (
              <section className="rounded-2xl md:rounded-3xl border border-white/80 bg-white/92 p-3 md:p-5 shadow-[0_10px_28px_rgba(148,163,184,0.06)]">
                <div className="flex items-center gap-2.5">
                  <Crown className="h-5 w-5 text-violet-500" />
                  <h3 className="text-lg font-semibold text-slate-900">{unlockTitle}</h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">{unlockDescription}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {lockedPreviewNotes.slice(0, 3).map((note) => (
                    <div
                      key={`${note.title}-${note.body}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {note.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{note.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {journeySteps.map((step) => {
                    const styles =
                      step.key === 'express'
                        ? expressStyles
                        : step.key === 'improve'
                          ? improveStyles
                          : step.key === 'speak'
                            ? speakStyles
                            : understandStyles;

                    return (
                      <div
                        key={step.key}
                        className={`rounded-2xl border border-slate-200 bg-white p-3 border-l-4 ${styles.border}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                            {step.title}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles.badge}`}
                          >
                            {step.done ? 'seen' : 'preview'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.caption}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-[0_4px_16px_rgba(148,163,184,0.08)]">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-bold text-slate-900">Current loop</h3>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {journeySteps.map((step) => {
                    const styles =
                      step.key === 'express'
                        ? expressStyles
                        : step.key === 'improve'
                          ? improveStyles
                          : step.key === 'speak'
                            ? speakStyles
                            : understandStyles;

                    return (
                      <div
                        key={step.key}
                        className={`rounded-2xl border border-slate-200 bg-white p-3 border-l-4 ${styles.border}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${styles.label}`}>
                            {step.title}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles.badge}`}
                          >
                            {step.done ? 'done' : 'next'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.caption}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Current sentence
                      </p>
                      {hasAnalysis && primarySentence ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openSave('grammar', primarySentence)}
                          className="-mr-1 -mt-1 h-7 gap-1 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          Save
                        </Button>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {primarySentence || 'No sentence yet. Start with one honest thought.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Focus
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{focusText}</p>
                    {focusSupport ? (
                      <p className="mt-2 text-sm leading-6 text-[#D66A4E]">
                        {focusSupport}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4.5 w-4.5 text-emerald-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Next
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {hasAnalysis
                        ? 'Say the improved sentence, then open Logic.'
                        : 'Open Grammar and shape the same sentence first.'}
                    </p>

                    {nextStepSupport ? (
                      <p className="mt-2 text-sm leading-6 text-[#D66A4E]">
                        {nextStepSupport}
                      </p>
                    ) : null}
                  </div>
                </div>

                {grammarPoints.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Grammar points
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {grammarPoints.slice(0, 6).map((point, i) => (
                        <button
                          key={`${point}-${i}`}
                          type="button"
                          onClick={() => openSave('grammar', point)}
                          className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-rose-300 hover:bg-rose-50"
                        >
                          <span className="truncate">{point}</span>
                          <BookmarkPlus className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-rose-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {teacherMemorySummary.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      What Mercy remembers
                    </p>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {teacherMemorySummary.slice(0, 4).map((item, index) => (
                        <div
                          key={`${item.type}-${index}-${item.label}`}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          {getMemoryIcon(item.type)}
                          <p className="text-sm leading-6 text-slate-700">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {latestWriting ? (
                  primarySentence && primarySentence !== latestWriting ? (
                    <div className="mt-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/55 to-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                        Original → current
                      </p>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Original
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{latestWriting}</p>
                        </div>

                        <div className="rounded-2xl border border-violet-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                            Current
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{primarySentence}</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                ) : (
                  <div className="mt-4 rounded-2xl border border-rose-100/80 bg-gradient-to-r from-[#FFF8F1] via-white to-[#F8FAFF] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
                      Start ideas
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {PROMPTS.slice(0, 4).map((prompt) => (
                        <span
                          key={prompt}
                          className="rounded-full border border-rose-200/80 bg-white px-3 py-1.5 text-sm font-medium text-rose-700"
                        >
                          {prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <NotebookPanel />
          </div>
        </div>
      </ScrollArea>

      {savePopup ? (
        <SaveWordPopup
          open={true}
          onOpenChange={(next) => {
            if (!next) setSavePopup(null);
          }}
          itemType={savePopup.itemType}
          contentEn={savePopup.contentEn}
          source="teacher"
        />
      ) : null}
    </div>
  );
}

export default MercyTeacherTab;
