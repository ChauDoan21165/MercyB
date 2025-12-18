  // Initialize room on load or when roomId changes
  useEffect(() => {
    let cancelled = false;

    const loadRoomData = async () => {
      setRoomLoading(true);
      setRoomError(null);

      // Reset state when switching rooms
      setMainMessages([]);
      setKeywordMenu(null);
      setRoomEssay(null);
      setCurrentAudio(null);
      setIsAudioPlaying(false);
      setMergedEntries([]);
      setMatchedEntryId(null);

      // Track this room visit
      if (canonicalRoomId && info) {
        addRecentRoom({
          id: canonicalRoomId,
          nameEn: currentRoom.nameEn,
          nameVi: currentRoom.nameVi,
          tier: info.tier || "free",
        });
      }

      try {
        const result = await loadMergedRoom(canonicalRoomId);

        // Cancelled early return
        if (cancelled) return;

        setMergedEntries(result.merged);
        setAudioBasePath(result.audioBasePath || "/");
        setLoadedRoomTier(result.roomTier || null);

        const isPreview = result.hasFullAccess === false && result.merged.length > 0;
        setIsPreviewMode(isPreview);

        // ✅ Handle JSON_INVALID distinctly
        if (result.errorCode === "JSON_INVALID") {
          setRoomError({ 
            kind: "json_invalid" as RoomErrorKind, 
            message: `Invalid or corrupted room data (ID: ${canonicalRoomId})` 
          });
          setRoomLoading(false);
          return;
        }

        if (result.errorCode === "ROOM_NOT_FOUND") {
          setRoomError({ 
            kind: "not_found", 
            message: canonicalRoomId ? `Room ID: ${canonicalRoomId}` : undefined 
          });
          setRoomLoading(false);
          return;
        }

        if (!result.merged || result.merged.length === 0) {
          console.warn(`No merged entries for room ${canonicalRoomId} tier ${tier}`);
        }

        setKeywordMenu(result.keywordMenu);

        // Load room essay from database
        const { data: dbRoom } = await supabase
          .from(ROOMS_TABLE)
          .select("room_essay_en, room_essay_vi")
          .eq("id", canonicalRoomId)
          .maybeSingle();

        if (dbRoom?.room_essay_en || dbRoom?.room_essay_vi) {
          setRoomEssay({
            en: dbRoom.room_essay_en || "",
            vi: dbRoom.room_essay_vi || "",
          });
        }

        clearCustomKeywordMappings();

        setMainMessages([]);
        setRoomLoading(false);
      } catch (error: any) {
        if (cancelled) return;

        console.error("Failed to load room data", error);

        const errorMessage = String(error?.message || error);
        let errorKind: RoomErrorKind = "unknown";
        let errorText: string | undefined;

        if (errorMessage.includes("AUTHENTICATION_REQUIRED")) {
          errorKind = "auth";
        } else if (errorMessage.includes("ACCESS_DENIED_INSUFFICIENT_TIER")) {
          errorKind = "access";
        } else if (errorMessage.includes("ROOM_NOT_FOUND") || error?.name === "RoomJsonNotFoundError") {
          errorKind = "not_found";
          errorText = canonicalRoomId ? `Room ID: ${canonicalRoomId}` : undefined;
        } else {
          errorKind = "unknown";
          errorText = "Failed to load room. This room may not exist or you may not have access.";
        }

        setRoomError({ kind: errorKind, message: errorText });
        setMainMessages([]);
        setRoomLoading(false);
      }
    };

    loadRoomData();

    return () => {
      cancelled = true;
    };
  }, [canonicalRoomId]);