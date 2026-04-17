/**
 * Path: src/components/mercy-guide/kids/kidPage9Data.ts
 * File: kidPage9Data.ts
 */

export type KidPage9LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const KID_PAGE9_KEYS = Array.from({ length: 80 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');

  const names = [
    'wake_up','open_eyes','stretch_in_bed','get_out_of_bed','go_to_the_bathroom',
    'wash_face','brush_teeth','rinse_mouth','dry_face','comb_hair',
    'take_off_pajamas','put_on_shirt','put_on_shorts','put_on_socks','put_on_shoes',
    'eat_breakfast','drink_milk','drink_water','eat_bread','finish_breakfast',
    'pack_school_bag','put_on_backpack','say_goodbye_to_mom','go_to_school','arrive_at_school',
    'go_to_class','sit_at_desk','take_out_books','listen_to_teacher','raise_hand',
    'read_a_book','write_in_notebook','draw_a_picture','learn_new_words','answer_a_question',
    'eat_lunch','drink_juice_at_lunch','talk_to_friends','play_outside','run_and_play',
    'drink_water_outside','rest_a_little','go_back_to_class','pack_up_to_go_home','say_goodbye_at_school',
    'walk_home','arrive_home','take_off_shoes','put_down_backpack','change_clothes',
    'wash_hands','eat_a_snack','drink_juice','do_homework','read_at_home',
    'play_with_toys','watch_something','help_at_home','eat_dinner','drink_water_at_dinner',
    'help_clear_table','take_a_bath','wash_hair','rinse_off','dry_off',
    'put_on_pajamas','brush_teeth_at_night','drink_water_before_bed','read_a_bedtime_story','say_goodnight',
    'turn_off_the_light','lie_down','close_eyes','sleep','dream',
    'wake_up_again','feel_fresh','look_outside','say_good_morning','ready_for_the_day'
  ];

  return `k9_${num}_${names[i]}`;
});

function clean(value?: string | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalize(key?: string | null) {
  return clean(key).replace(/\.png$/i, '');
}

function wordsFromKey(key: string) {
  return key.replace(/^k9_\d+_/i, '').split('_');
}

function toLabel(key: string) {
  return wordsFromKey(key)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function toSentence(key: string) {
  const text = wordsFromKey(key).join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

function toAliases(key: string) {
  const words = wordsFromKey(key);
  const phrase = words.join(' ');
  return [key, phrase, phrase.replace(/\s+/g, '-')];
}

export const KID_PAGE9_LESSONS: KidPage9LessonCard[] = KID_PAGE9_KEYS.map((key) => ({
  key,
  label: toLabel(key),
  sentence: toSentence(key),
  imageSrc: `/images/mercy-kids-page-9/${key}.png`,
  aliases: toAliases(key),
}));

export function getPage9LessonByKey(key?: string | null) {
  const normalized = normalize(key);
  return KID_PAGE9_LESSONS.find((l) => l.key === normalized) ?? null;
}