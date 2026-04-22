// Mercy Blade original songs, served from the Supabase Storage public bucket `music`.
// Only filenames live here — getPublicAudioUrl() turns each one into a playable URL.
//
// Fesliyan royalty-free background tracks were intentionally dropped from the bar
// in this consolidation (no licensing re-hosting work, cleaner brand focus).

export type MusicTrack = {
  id: string;
  title: string;
  file: string;
};

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'mb1',  title: 'In A Quiet Room I Open My Mind',                    file: 'in_a_quiet_room_i_open_my_mind.mp3' },
  { id: 'mb2',  title: 'In A Quiet Room I Open My Mind (2)',                file: 'in_a_quiet_room_i_open_my_mind_2.mp3' },
  { id: 'mb3',  title: 'When Mercy Looks at Me',                            file: 'when_mercy_looks_at_me.mp3' },
  { id: 'mb4',  title: 'When Mercy Looks at Me (1)',                        file: 'when_mercy_looks_at_me_1.mp3' },
  { id: 'mb5',  title: 'When Mercy Looks at Me (2)',                        file: 'when_mercy_looks_at_me_2.mp3' },
  { id: 'mb6',  title: 'When Mercy Looks at Me (3)',                        file: 'when_mercy_looks_at_me_3.mp3' },
  { id: 'mb7',  title: 'Heart of the Blade',                                file: 'heart_of_the_blade.mp3' },
  { id: 'mb8',  title: 'Heart of the Blade (1)',                            file: 'heart_of_the_blade_1.mp3' },
  { id: 'mb8b', title: 'Heart of the Blade (2)',                            file: 'heart_of_the_blade_2.mp3' },
  { id: 'mb9',  title: 'Rise With Mercy',                                   file: 'rise_with_mercy.mp3' },
  { id: 'mb10', title: 'Where Mercy Finds Me',                              file: 'where_mercy_finds_me.mp3' },
  { id: 'mb11', title: 'Where Mercy Finds Me (1)',                          file: 'where_mercy_finds_me_1.mp3' },
  { id: 'mb12', title: 'Where Mercy Finds Me (2)',                          file: 'where_mercy_finds_me_2.mp3' },
  { id: 'mb13', title: 'Where Mercy Finds Me (3)',                          file: 'where_mercy_finds_me_3.mp3' },
  { id: 'mb14', title: 'Where Mercy Finds Me (4)',                          file: 'where_mercy_finds_me_4.mp3' },
  { id: 'mb15', title: 'Where Mercy Finds Me (4 v2)',                       file: 'where_mercy_finds_me_4_v2.mp3' },
  { id: 'mb16', title: 'Where Mercy Finds Me (5)',                          file: 'where_mercy_finds_me_5.mp3' },
  { id: 'mb17', title: 'Where Mercy Finds Me (6)',                          file: 'where_mercy_finds_me_6.mp3' },
  { id: 'mb18', title: 'Mercy On My Mind',                                  file: 'mercy_on_my_mind.mp3' },
  { id: 'mb19', title: 'Mercy On My Mind (1)',                              file: 'mercy_on_my_mind_1.mp3' },
  { id: 'mb20', title: 'Mercy On My Mind (2)',                              file: 'mercy_on_my_mind_2.mp3' },
  { id: 'mb21', title: 'Mercy On My Mind (3)',                              file: 'mercy_on_my_mind_3.mp3' },
  { id: 'mb22', title: 'In the Quiet Mercy',                                file: 'in_the_quiet_mercy.mp3' },
  { id: 'mb23', title: 'In the Quiet Mercy (2)',                            file: 'in_the_quiet_mercy_2.mp3' },
  { id: 'mb24', title: 'Step With Me Mercy',                                file: 'step_with_me_mercy.mp3' },
  { id: 'mb25', title: 'Step With Me Mercy (2)',                            file: 'step_with_me_mercy_2.mp3' },
  { id: 'mb26', title: 'In A Quiet Room I Open My Mind (3)',                file: 'in_a_quiet_room_i_open_my_mind_3.mp3' },
  { id: 'mb29', title: 'Bridge of Hearts',                                  file: 'bridge_of_hearts.mp3' },
  { id: 'mb31', title: 'Say My Name, Mercy Blade (core)',                   file: 'say_my_name_mercy_blade_core.mp3' },
  { id: 'mb32', title: 'Say My Name, Mercy Blade (1)',                      file: 'say_my_name_mercy_blade_1.mp3' },
  { id: 'mb34', title: 'Morning With You / Buổi Sáng Cùng Ngài (2)',        file: 'morning_with_you_2.mp3' },
  { id: 'mb35', title: 'The Song of Mercy Blade (2)',                       file: 'song_of_mercy_blade_2.mp3' },
  { id: 'mb36', title: 'The Song of Mercy Blade (3)',                       file: 'song_of_mercy_blade_3.mp3' },
  { id: 'mb37', title: 'Tâm Hồn Tự Tại / A Mind at Peace',                  file: 'tam_hon_tu_tai.mp3' },
  { id: 'mb38', title: 'Ánh Sáng Trong Vòng Tay Cha (1)',                   file: 'anh_sang_trong_vong_tay_cha_1.mp3' },
  { id: 'mb39', title: 'Dấu Ấn Trong Tôi / The Prints Within (1)',          file: 'dau_an_trong_toi_1.mp3' },
  { id: 'mb40', title: 'Sự Sắp Đặt Thiêng Liêng',                           file: 'su_sap_dat_thieng_lieng.mp3' },
];
